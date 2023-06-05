package log

import "github.com/sirupsen/logrus"

type Level string

const (
	LevelTrace Level = "trace"
	LevelDebug Level = "debug"
	LevelInfo  Level = "info"
	LevelWarn  Level = "warn"
	LevelError Level = "error"
)

var ValidLevelStrings = []string{
	string(LevelTrace),
	string(LevelDebug),
	string(LevelInfo),
	string(LevelWarn),
	string(LevelError),
}

var LevelMap = map[Level]logrus.Level{
	LevelTrace: logrus.TraceLevel,
	LevelDebug: logrus.DebugLevel,
	LevelInfo:  logrus.InfoLevel,
	LevelWarn:  logrus.WarnLevel,
	LevelError: logrus.ErrorLevel,
}

type Format string

const (
	FormatJSON Format = "json"
	FormatText Format = "text"
)

var ValidFormatStrings = []string{
	string(FormatJSON),
	string(FormatText),
}
