package main

import (
	"io"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/natrontech/kubelab-agent/color"
	"github.com/sirupsen/logrus"
)

var cmd *exec.Cmd
var cmdIn io.WriteCloser
var log = logrus.New()

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.WithFields(logrus.Fields{
			"error": err,
		}).Fatal("Failed to upgrade connection")
	}

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.WithFields(logrus.Fields{
				"error": err,
			}).Error("Failed to read message")
			return
		}

		msg := string(message)
		log.WithFields(logrus.Fields{
			"message": msg,
		}).Info("Received message")
		if strings.HasPrefix(msg, "\t") {
			msg = strings.TrimPrefix(msg, "\t")
			cmd := exec.Command("bash", "-c", "compgen -c "+msg)
			output, err := cmd.Output()
			if err != nil {
				ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Red, err.Error()+"\n")))
				continue
			}

			ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Cyan, "\t"+strings.Join(strings.Fields(string(output)), ","))))
		} else if strings.HasPrefix(msg, "less ") {
			file, err := os.Open(strings.TrimPrefix(msg, "less "))
			if err != nil {
				ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Red, err.Error()+"\n")))
				continue
			}

			content, err := io.ReadAll(file)
			if err != nil {
				ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Red, err.Error()+"\n")))
				continue
			}

			ws.WriteMessage(websocket.TextMessage, append([]byte(color.Colorize(color.Cyan, string(content))), '\n'))

			file.Close()
		} else {
			cmd := exec.Command("bash", "-c", msg)
			output, err := cmd.Output()
			if err != nil {
				ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Red, err.Error()+"\n")))
				continue
			}

			ws.WriteMessage(websocket.TextMessage, []byte(color.Colorize(color.Cyan, string(output))))
		}
	}
}

func main() {

	log.SetFormatter(&logrus.JSONFormatter{})
	http.HandleFunc("/ws", handleConnections)

	log.WithFields(logrus.Fields{
		"port": ":8080",
	}).Info("Starting server")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.WithFields(logrus.Fields{
			"error": err,
		}).Fatal("Failed to start server")
	}
}
