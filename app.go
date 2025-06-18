package main

import (
	"bytes"
	"context"
	"encoding/binary"
	"encoding/hex"
	"errors"
	"fmt"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/spf13/viper"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.bug.st/serial"
)

type Monitor struct {
	ID     uuid.UUID `json:"id"`
	ctx    context.Context
	cancel context.CancelFunc
	Port   string `json:"port"`
	mode   serial.Mode
}

type App struct {
	ctx             context.Context
	monitors        map[uuid.UUID]*Monitor
	selectMonitor   chan *Monitor
	unselectMonitor chan uuid.UUID
	message         chan []byte
	result          chan []float32
	measurement     *MeasurementService
	logger          AppLogger
	config          *Config
}

func NewApp(measurement *MeasurementService, logger AppLogger) *App {

	return &App{
		monitors:        make(map[uuid.UUID]*Monitor),
		selectMonitor:   make(chan *Monitor),
		unselectMonitor: make(chan uuid.UUID),
		message:         make(chan []byte),
		result:          make(chan []float32),
		measurement:     measurement,
		logger:          logger,
	}
}

func hexToFloat(dataPipe []string) []float32 {
	result := []float32{}
	for _, v := range dataPipe {
		data, err := hex.DecodeString(v)
		if err != nil {
			continue
		}
		if len(data) != 4 {
			continue
		}
		bits := binary.BigEndian.Uint32(data)
		f := math.Float32frombits(bits)
		result = append(result, f)
	}

	return result
}

func (a *App) ready() {
	if a.config.PORT != "" {
		a.logger.Debug("PORT NOT EMPTY " + a.config.PORT)
		if err := a.SelectMonitor(a.config.PORT); err != nil {
			a.logger.Error(err)
		}
	}

}

func (a *App) onSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	secondInstanceArgs := secondInstanceData.Args

	runtime.WindowUnminimise(a.ctx)
	runtime.Show(a.ctx)
	go runtime.EventsEmit(a.ctx, "launchArgs", secondInstanceArgs)
}

func (a *App) startup(ctx context.Context, conf *Config) {
	a.logger.Info("Application started")
	a.logger.Debug("Application started with config: " + conf.Name)
	a.ctx = ctx
	a.config = conf
	a.measurement.start(ctx)

	for {
		select {
		case monitor := <-a.selectMonitor:
			go a.run(monitor)
		case id := <-a.unselectMonitor:
			if monitor, ok := a.monitors[id]; ok {
				monitor.cancel()
				delete(a.monitors, id)
			}
		case message := <-a.message:
			a.logger.Debug("message received: " + string(message))
			msg := strings.Split(string(message), string(rune(0x1B)))

			if len(msg) != 5 {
				a.logger.Error("message splinting with 0x1B lessthan 5")
				return
			}
			var dataPipe []string = strings.Split(msg[4], string(rune(0x1A)))

			if len(dataPipe) != 7 {
				a.logger.Error("data pipe less than 7 buffer")
				return
			}
			result := hexToFloat(dataPipe[:6])
			a.logger.Debug("result: " + strings.Join(dataPipe[:6], ", "))
			res := Result{
				Height: result[3],
				Weigth: result[0],
				BMI:    result[1],
			}
			measurement := Measurement{
				Weight: res.Weigth,
				Height: res.Height,
				BMI:    res.BMI,
			}
			a.logger.Debug("measurement: " + fmt.Sprintf("%+v", measurement))
			if err := a.measurement.Create(&measurement); err != nil {
				a.logger.Error(err)
			}
			a.logger.Debug("measurement saved to database")

		case <-a.ctx.Done():
			return
		}
	}
}

func (a *App) GetMonitors() ([]Monitor, error) {
	monitors := []Monitor{}
	for _, monitor := range a.monitors {
		monitors = append(monitors, *monitor)
	}
	return monitors, nil

}

func (a *App) SelectMonitor(port string) error {
	ports, err := serial.GetPortsList()
	if err != nil {
		a.logger.Error("failed to get serial ports: " + err.Error())
		return err
	}
	// Check if the port is valid
	validPort := false
	for _, p := range ports {
		if p == port {
			validPort = true
			break
		}
	}
	if !validPort {
		a.config.PORT = ""
		viper.Set("PORT", "")
		if err := viper.WriteConfig(); err != nil {
			a.logger.Error("failed to write config: " + err.Error())
		}
		a.logger.Error("invalid serial port: " + port)

		return errors.New("invalid serial port: " + port)
	}
	viper.Set("PORT", port)

	if err := viper.WriteConfig(); err != nil {
		a.logger.Error("failed to write config: " + err.Error())
	}
	ctx, cancel := context.WithCancel(a.ctx)
	mode := serial.Mode{
		BaudRate: 115200,
		StopBits: serial.OneStopBit,
		Parity:   serial.NoParity,
		DataBits: 8,
	}
	monitor := &Monitor{
		ID:     uuid.New(),
		ctx:    ctx,
		cancel: cancel,
		Port:   port,
		mode:   mode,
	}
	a.selectMonitor <- monitor
	a.monitors[monitor.ID] = monitor
	return nil
}

func (a *App) UnselectMonitor(id uuid.UUID) {
	a.unselectMonitor <- id
}

func (a *App) GetSerialPort() ([]string, error) {
	return serial.GetPortsList()
}

var startMessage = []byte{0x02, 0x68, 0x0D, 0x0B, 0x52, 0x45, 0x31, 0x30, 0x49}

func (a *App) run(m *Monitor) {
	port, err := serial.Open(m.Port, &m.mode)
	if err != nil {
		a.logger.Error(err)
		return
	}
	defer port.Close()

	buff := make([]byte, 1024)
	message := []byte{}
	for {
		n, err := port.Read(buff)
		if err != nil {

			a.logger.Error(err)
			delete(a.monitors, m.ID)
			message = []byte{}
		}
		if n == 0 {
			message = []byte{}
		}

		message = append(message, buff[:n]...)

		if strings.Contains(string(buff[:n]), string(byte(0x03))) {
			if bytes.Contains(message, startMessage) {
				a.message <- message
			}
			message = []byte{}

		}

		if strings.Contains(string(buff[n:]), "\n") {
			break
		}

		if m.ctx.Err() != nil {
			return
		}
	}
}

func (a *App) TestReult() {
	var f = []float32{50, 20, 0, 172, 89, 90}
	a.result <- f
}
