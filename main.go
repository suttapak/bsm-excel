package main

import (
	"context"
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	logger, err := NewAppLogger()
	if err != nil {
		log.Fatal(err)
	}
	// Create an instance of the app structure
	measurement, err := NewMeasurement(logger)
	if err != nil {
		log.Fatal(err)
	}
	app := NewApp(measurement, logger)
	// Create application with options
	err = wails.Run(&options.App{
		Title:         "BSM 370 Computer Interface",
		Width:         1024,
		Height:        768,
		DisableResize: true,
		Fullscreen:    false,
		Frameless:     false,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			measurement.start(ctx)
		},
		Bind: []interface{}{
			app,
			measurement,
		},
	})

	if err != nil {
		logger.Error(err)
	}
}
