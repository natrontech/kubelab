package xtermjs

import "fmt"

// TTYSize represents a JSON structure to be sent by the frontend
// xterm.js implementation to the xterm.js websocket handler
type TTYSize struct {
	Cols uint16 `json:"cols"`
	Rows uint16 `json:"rows"`
	X    uint16 `json:"x"`
	Y    uint16 `json:"y"`
}

// Logger is the logging interface used by the xterm.js handler
type Logger interface {
	Trace(...interface{})
	Tracef(string, ...interface{})
	Debug(...interface{})
	Debugf(string, ...interface{})
	Info(...interface{})
	Infof(string, ...interface{})
	Warn(...interface{})
	Warnf(string, ...interface{})
	Error(...interface{})
	Errorf(string, ...interface{})
}

type logger struct{}

func (l logger) Trace(i ...interface{})            { fmt.Println(append([]interface{}{"[trace] "}, i...)...) }
func (l logger) Tracef(s string, i ...interface{}) { fmt.Printf("[trace] "+s+"\n", i...) }
func (l logger) Debug(i ...interface{})            { fmt.Println(append([]interface{}{"[debug] "}, i...)...) }
func (l logger) Debugf(s string, i ...interface{}) { fmt.Printf("[debug] "+s+"\n", i...) }
func (l logger) Info(i ...interface{})             { fmt.Println(append([]interface{}{"[info] "}, i...)...) }
func (l logger) Infof(s string, i ...interface{})  { fmt.Printf("[info] "+s+"\n", i...) }
func (l logger) Warn(i ...interface{})             { fmt.Println(append([]interface{}{"[warn] "}, i...)...) }
func (l logger) Warnf(s string, i ...interface{})  { fmt.Printf("[warn] "+s+"\n", i...) }
func (l logger) Error(i ...interface{})            { fmt.Println(append([]interface{}{"[error] "}, i...)...) }
func (l logger) Errorf(s string, i ...interface{}) { fmt.Printf("[error] "+s+"\n", i...) }

var defaultLogger = logger{}
