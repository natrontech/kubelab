package xtermjs

import (
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

func getConnectionUpgrader(
	allowedHostnames []string,
	maxBufferSizeBytes int,
	logger Logger,
) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			requesterHostname := r.Host
			if strings.Index(requesterHostname, ":") != -1 {
				requesterHostname = strings.Split(requesterHostname, ":")[0]
			}
			for _, allowedHostname := range allowedHostnames {
				if requesterHostname == allowedHostname {
					return true
				}
			}
			logger.Warnf("failed to find '%s' in the list of allowed hostnames ('%s')", requesterHostname)
			return false
		},
		HandshakeTimeout: 0,
		ReadBufferSize:   maxBufferSizeBytes,
		WriteBufferSize:  maxBufferSizeBytes,
	}
}
