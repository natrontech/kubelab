package log

import (
	"fmt"
	"os"
	"path"
	"runtime"

	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

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

// Log defines the function signature of the logger
type Log func(l ...interface{})

// Log defines the function signature of the logger when called with format parameters
type Logf func(s string, l ...interface{})

var WithField,
	WithFields = logger.WithField,
	logger.WithFields

// Trace logs at the Trace level
var Trace,
	// Debug logs at the Debug level
	Debug,
	// Info logs at the Info level
	Info,
	// Warn logs at the Warn level
	Warn,
	// Error logs at the Error level
	Error,
	Print Log = logger.Trace,
	logger.Debug,
	logger.Info,
	logger.Warn,
	logger.Error,
	func(l ...interface{}) {
		fmt.Println(l...)
	}

// Tracef logs at the trace level with formatting
var Tracef,
	// Debugf logs at the debug level with formatting
	Debugf,
	// Infof logs at the info level with formatting
	Infof,
	// Warnf logs at the warn level with formatting
	Warnf,
	// Errorf logs at the error level with formatting
	Errorf,
	Printf Logf = logger.Tracef,
	logger.Debugf,
	logger.Infof,
	logger.Warnf,
	logger.Errorf,
	func(s string, l ...interface{}) {
		fmt.Printf(s, l...)
		fmt.Printf("\n")
	}

func Init(
	logFormat Format,
	logLevel Level,
) {
	logger.SetLevel(LevelMap[logLevel])

	logger.SetOutput(os.Stderr)
	logger.SetReportCaller(true)
	if logFormat == FormatJSON {
		logger.SetFormatter(&logrus.JSONFormatter{
			CallerPrettyfier: func(frame *runtime.Frame) (function string, file string) {
				function = frame.Function
				file = path.Base(frame.File)
				return
			},
			DataKey:         "@data",
			TimestampFormat: "2006-01-02T15:04:05-0700",
			FieldMap: logrus.FieldMap{
				logrus.FieldKeyFile:        "@file",
				logrus.FieldKeyFunc:        "@func",
				logrus.FieldKeyLevel:       "@level",
				logrus.FieldKeyMsg:         "@message",
				logrus.FieldKeyTime:        "@timestamp",
				logrus.FieldKeyLogrusError: "@error",
			},
		})
		return
	}
	logger.SetFormatter(&logrus.TextFormatter{
		CallerPrettyfier: func(frame *runtime.Frame) (function string, file string) {
			function = path.Base(frame.Function)
			file = path.Base(frame.File)
			return
		},
		TimestampFormat:  "15:04:05",
		DisableSorting:   false,
		FullTimestamp:    true,
		QuoteEmptyFields: true,
		ForceQuote:       true,
	})
}
