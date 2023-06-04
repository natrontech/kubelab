// package main

// import (
// 	"io"
// 	"log"
// 	"net/http"
// 	"os"
// 	"os/exec"
// 	"strings"

// 	"github.com/gorilla/websocket"
// )

// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// 	CheckOrigin: func(r *http.Request) bool {
// 		return true
// 	},
// }

// func handleConnections(w http.ResponseWriter, r *http.Request) {
// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	for {
// 		_, message, err := ws.ReadMessage()
// 		if err != nil {
// 			log.Println("read:", err)
// 			return
// 		}

// 		msg := string(message)
// 		if strings.HasPrefix(msg, "\t") {
// 			// Remove the tab character
// 			msg = strings.TrimPrefix(msg, "\t")
// 			// Execute a compgen command to generate auto-complete suggestions
// 			cmd := exec.Command("bash", "-c", "compgen -c "+msg)
// 			output, err := cmd.Output()
// 			if err != nil {
// 				ws.WriteMessage(websocket.TextMessage, []byte(err.Error()+"\n"))
// 				continue
// 			}
// 			// Send back a list of suggestions separated by commas
// 			ws.WriteMessage(websocket.TextMessage, []byte("\t"+strings.Join(strings.Fields(string(output)), ",")))
// 		} else if strings.HasPrefix(msg, "less ") {
// 			// Open the file
// 			file, err := os.Open(strings.TrimPrefix(msg, "less "))
// 			if err != nil {
// 				ws.WriteMessage(websocket.TextMessage, []byte(err.Error()+"\n"))
// 				continue
// 			}

// 			// Read the file content
// 			content, err := io.ReadAll(file)
// 			if err != nil {
// 				ws.WriteMessage(websocket.TextMessage, []byte(err.Error()+"\n"))
// 				continue
// 			}

// 			// Send the file content
// 			ws.WriteMessage(websocket.TextMessage, append(content, '\n'))

// 			file.Close()
// 		} else {
// 			cmd := exec.Command("bash", "-c", msg)
// 			output, err := cmd.Output()
// 			if err != nil {
// 				ws.WriteMessage(websocket.TextMessage, []byte(err.Error()+"\n"))
// 				continue
// 			}

// 			ws.WriteMessage(websocket.TextMessage, output)
// 		}
// 	}
// }

// func main() {
// 	http.HandleFunc("/ws", handleConnections)

// 	err := http.ListenAndServe(":8080", nil)
// 	if err != nil {
// 		log.Fatal("ListenAndServe: ", err)
// 	}
// }
