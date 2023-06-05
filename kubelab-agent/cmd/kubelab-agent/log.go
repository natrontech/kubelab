package main

import (
	"net/http"
	"runtime"

	"github.com/natrontech/kubelab-agent/internal/log"
)

// createRequestLog returns a logger with relevant request fields
func createRequestLog(r *http.Request, additionalFields ...map[string]interface{}) log.Logger {
	fields := map[string]interface{}{}
	if len(additionalFields) > 0 {
		fields = additionalFields[0]
	}
	if r != nil {
		fields["host"] = r.Host
		fields["remote_addr"] = r.RemoteAddr
		fields["method"] = r.Method
		fields["protocol"] = r.Proto
		fields["path"] = r.URL.Path
		fields["request_url"] = r.URL.String()
		fields["user_agent"] = r.UserAgent()
		fields["cookies"] = r.Cookies()
	}
	return log.WithFields(fields)
}

func createMemoryLog() log.Logger {
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)
	return log.WithFields(map[string]interface{}{
		"alloc":       memStats.Alloc,
		"heap_alloc":  memStats.HeapAlloc,
		"total_alloc": memStats.TotalAlloc,
		"sys_alloc":   memStats.Sys,
		"gc_count":    memStats.NumGC,
	})
}
