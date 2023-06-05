package main

import (
	"net/http"
	"time"
)

func addIncomingRequestLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		then := time.Now()
		defer func() {
			if recovered := recover(); recovered != nil {
				createRequestLog(r).Info("request errored out")
			}
		}()
		next.ServeHTTP(w, r)
		duration := time.Now().Sub(then)
		createRequestLog(r).Infof("request completed in %vms", float64(duration.Nanoseconds())/1000000)
	})
}
