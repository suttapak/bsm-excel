package main

import (
	"log"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type AppLogger interface {
	Info(message string, fields ...zap.Field)
	Debug(message string, fields ...zap.Field)
	Error(message interface{}, fields ...zap.Field)
}

type appLogger struct {
	logger *zap.Logger
}

// ensureDir checks if a directory exists and creates it if not.
func ensureDir(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.MkdirAll(path, 0755) // Creates parent directories if needed
		if err != nil {
			return err
		}
	}
	return nil
}

func NewAppLogger() (AppLogger, error) {

	// Define log directories

	// Ensure all log directories exist
	if err := ensureDir("./logs"); err != nil {
		log.Fatalf("Failed to create log directory: %s, error: %v", "logs", err)
	}
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.StacktraceKey = ""

	config.OutputPaths = []string{"./logs/logs.log"}
	config.ErrorOutputPaths = []string{"./logs/errs.log"}

	logger, err := config.Build(zap.AddCallerSkip(1))
	if err != nil {
		return nil, err
	}
	// logger.Info("initialed logger")
	return &appLogger{logger: logger}, nil
}
func (a *appLogger) Info(message string, fields ...zap.Field) {
	a.logger.Info(message, fields...)
}

func (a *appLogger) Debug(message string, fields ...zap.Field) {
	a.logger.Debug(message, fields...)
}

func (a *appLogger) Error(message interface{}, fields ...zap.Field) {
	switch v := message.(type) {
	case error:
		a.logger.Error(v.Error(), fields...)
	case string:
		a.logger.Error(v, fields...)
	}
}
