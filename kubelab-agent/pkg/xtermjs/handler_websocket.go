package xtermjs

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/creack/pty"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/natrontech/kubelab-agent/internal/log"
)

const DefaultConnectionErrorLimit = 10

type HandlerOpts struct {
	// AllowedHostnames is a list of strings which will be matched to the client
	// requesting for a connection upgrade to a websocket connection
	AllowedHostnames []string
	// Arguments is a list of strings to pass as arguments to the specified COmmand
	Arguments []string
	// Command is the path to the binary we should create a TTY for
	Command string
	// ConnectionErrorLimit defines the number of consecutive errors that can happen
	// before a connection is considered unusable
	ConnectionErrorLimit int
	// CreateLogger when specified should return a logger that the handler will use.
	// The string argument being passed in will be a unique identifier for the
	// current connection. When not specified, logs will be sent to stdout
	CreateLogger func(string, *http.Request) Logger
	// KeepalivePingTimeout defines the maximum duration between which a ping and pong
	// cycle should be tolerated, beyond this the connection should be deemed dead
	KeepalivePingTimeout time.Duration
	MaxBufferSizeBytes   int
}

func GetHandler(opts HandlerOpts) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		connectionErrorLimit := opts.ConnectionErrorLimit
		if connectionErrorLimit < 0 {
			connectionErrorLimit = DefaultConnectionErrorLimit
		}
		maxBufferSizeBytes := opts.MaxBufferSizeBytes
		keepalivePingTimeout := opts.KeepalivePingTimeout
		if keepalivePingTimeout <= time.Second {
			keepalivePingTimeout = 20 * time.Second
		}

		connectionUUID, err := uuid.NewUUID()
		if err != nil {
			message := "failed to get a connection uuid"
			log.Errorf("%s: %s", message, err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(message))
			return
		}
		var clog Logger = defaultLogger
		if opts.CreateLogger != nil {
			clog = opts.CreateLogger(connectionUUID.String(), r)
		}
		clog.Info("established connection identity")

		allowedHostnames := opts.AllowedHostnames
		upgrader := getConnectionUpgrader(allowedHostnames, maxBufferSizeBytes, clog)
		connection, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			clog.Warnf("failed to upgrade connection: %s", err)
			return
		}

		terminal := opts.Command
		args := opts.Arguments
		clog.Debugf("starting new tty using command '%s' with arguments ['%s']...", terminal, strings.Join(args, "', '"))
		cmd := exec.Command(terminal, args...)
		cmd.Env = os.Environ()
		tty, err := pty.Start(cmd)
		if err != nil {
			message := fmt.Sprintf("failed to start tty: %s", err)
			clog.Warn(message)
			connection.WriteMessage(websocket.TextMessage, []byte(message))
			return
		}
		defer func() {
			clog.Info("gracefully stopping spawned tty...")
			if err := cmd.Process.Kill(); err != nil {
				clog.Warnf("failed to kill process: %s", err)
			}
			if _, err := cmd.Process.Wait(); err != nil {
				clog.Warnf("failed to wait for process to exit: %s", err)
			}
			if err := tty.Close(); err != nil {
				clog.Warnf("failed to close spawned tty gracefully: %s", err)
			}
			if err := connection.Close(); err != nil {
				clog.Warnf("failed to close webscoket connection: %s", err)
			}
		}()

		var connectionClosed bool
		var waiter sync.WaitGroup
		waiter.Add(1)

		// this is a keep-alive loop that ensures connection does not hang-up itself
		lastPongTime := time.Now()
		connection.SetPongHandler(func(msg string) error {
			lastPongTime = time.Now()
			return nil
		})
		go func() {
			for {
				if err := connection.WriteMessage(websocket.PingMessage, []byte("keepalive")); err != nil {
					clog.Warn("failed to write ping message")
					return
				}
				time.Sleep(keepalivePingTimeout / 2)
				if time.Now().Sub(lastPongTime) > keepalivePingTimeout {
					clog.Warn("failed to get response from ping, triggering disconnect now...")
					waiter.Done()
					return
				}
				clog.Debug("received response from ping successfully")
			}
		}()

		// tty >> xterm.js
		go func() {
			errorCounter := 0
			for {
				// consider the connection closed/errored out so that the socket handler
				// can be terminated - this frees up memory so the service doesn't get
				// overloaded
				if errorCounter > connectionErrorLimit {
					waiter.Done()
					break
				}
				buffer := make([]byte, maxBufferSizeBytes)
				readLength, err := tty.Read(buffer)
				if err != nil {
					clog.Warnf("failed to read from tty: %s", err)
					if err := connection.WriteMessage(websocket.TextMessage, []byte("bye!")); err != nil {
						clog.Warnf("failed to send termination message from tty to xterm.js: %s", err)
					}
					waiter.Done()
					return
				}
				if err := connection.WriteMessage(websocket.BinaryMessage, buffer[:readLength]); err != nil {
					clog.Warnf("failed to send %v bytes from tty to xterm.js", readLength)
					errorCounter++
					continue
				}
				clog.Tracef("sent message of size %v bytes from tty to xterm.js", readLength)
				errorCounter = 0
			}
		}()

		// tty << xterm.js
		go func() {
			for {
				// data processing
				messageType, data, err := connection.ReadMessage()
				if err != nil {
					if !connectionClosed {
						clog.Warnf("failed to get next reader: %s", err)
					}
					return
				}
				dataLength := len(data)
				dataBuffer := bytes.Trim(data, "\x00")
				dataType, ok := WebsocketMessageType[messageType]
				if !ok {
					dataType = "uunknown"
				}
				clog.Infof("received %s (type: %v) message of size %v byte(s) from xterm.js with key sequence: %v", dataType, messageType, dataLength, dataBuffer)

				// process
				if dataLength == -1 { // invalid
					clog.Warn("failed to get the correct number of bytes read, ignoring message")
					continue
				}

				// handle resizing
				if messageType == websocket.BinaryMessage {
					if dataBuffer[0] == 1 {
						ttySize := &TTYSize{}
						resizeMessage := bytes.Trim(dataBuffer[1:], " \n\r\t\x00\x01")
						if err := json.Unmarshal(resizeMessage, ttySize); err != nil {
							clog.Warnf("failed to unmarshal received resize message '%s': %s", string(resizeMessage), err)
							continue
						}
						clog.Infof("resizing tty to use %v rows and %v columns...", ttySize.Rows, ttySize.Cols)
						if err := pty.Setsize(tty, &pty.Winsize{
							Rows: ttySize.Rows,
							Cols: ttySize.Cols,
						}); err != nil {
							clog.Warnf("failed to resize tty, error: %s", err)
						}
						continue
					}
				}

				// write to tty
				bytesWritten, err := tty.Write(dataBuffer)
				if err != nil {
					clog.Warn(fmt.Sprintf("failed to write %v bytes to tty: %s", len(dataBuffer), err))
					continue
				}
				clog.Tracef("%v bytes written to tty...", bytesWritten)
			}
		}()

		waiter.Wait()
		log.Info("closing connection...")
		connectionClosed = true
	}
}
