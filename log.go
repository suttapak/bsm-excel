package main

import (
	"log"
	"os"
	"path/filepath"

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

func ensureFile(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		file, err := os.Create(path)
		if err != nil {
			return err
		}
		defer file.Close()
	}
	return nil
}

func NewAppLogger(conf *Config) (AppLogger, error) {
	// Define log directories
	ex, err := os.Executable()
	if err != nil {
		return nil, err
	}
	path := filepath.Join(filepath.Dir(ex), "logs")
	// Ensure all log directories exist
	if err := ensureDir(path); err != nil {
		log.Fatalf("Failed to create log directory: %s, error: %v", "logs", err)
	}
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.StacktraceKey = ""

	config.OutputPaths = []string{filepath.Join(path, "app.log")}

	if conf.EnableLog {
		config.ErrorOutputPaths = []string{filepath.Join(path, "errs.log")}
	}

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
