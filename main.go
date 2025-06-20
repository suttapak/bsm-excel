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
	// conf := NewAppConfig()
	// _ = conf // to avoid unused variable error
	conf := NewAppConfig()
	logger, err := NewAppLogger(conf)
	if err != nil {
		log.Fatal(err)
	}
	logger.Debug("initial config success")

	// Create an instance of the app structure
	measurement, err := NewMeasurement(logger)
	if err != nil {
		log.Fatal(err)
	}
	app := NewApp(measurement, logger)
	exporter := NewExporter(measurement, logger, conf)
	// Create application with options
	err = wails.Run(&options.App{
		Title:      "BSM 370 Computer Interface",
		Width:      1024,
		Height:     768,
		Fullscreen: false,
		Frameless:  false,

		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: func(ctx context.Context) {

			measurement.start(ctx)
			logger.Debug("initial measurement service success")
			exporter.SetContext(ctx)
			logger.Debug("initial exporter service success")
			app.startup(ctx, conf)
			logger.Debug("initial application success")

		},
		OnDomReady: func(ctx context.Context) {
			app.ready()
		},
		Bind: []interface{}{
			app,
			measurement,
			exporter,
			conf,
		},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "e3984e08-28dc-4e3d-b70a-45e961589cdc",
			OnSecondInstanceLaunch: app.onSecondInstanceLaunch,
		},
	})

	if err != nil {
		logger.Error(err)
	}
}
