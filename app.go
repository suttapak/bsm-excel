package main

import (
	"bytes"
	"context"
	"embed"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io/fs"
	"log"
	"math"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/xuri/excelize/v2"
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
	docs            *Docs
}

func NewApp() *App {

	return &App{
		monitors:        make(map[uuid.UUID]*Monitor),
		selectMonitor:   make(chan *Monitor),
		unselectMonitor: make(chan uuid.UUID),
		message:         make(chan []byte),
		result:          make(chan []float32),
	}
}

func hexToFloat(dataPipe []string) []float32 {
	result := []float32{}
	for _, v := range dataPipe {
		// Remove any null bytes and whitespace
		data, err := hex.DecodeString(v)
		if err != nil {
			// runtime.EventsEmit(a.ctx, "error", err)
			log.Println(err, "original:", v)
			continue
		}
		if len(data) != 4 {
			// runtime.EventsEmit(a.ctx, "error", data)
			log.Println("unexpected length:", len(data))
			continue
		}
		bits := binary.BigEndian.Uint32(data)
		f := math.Float32frombits(bits)
		result = append(result, f)
		fmt.Println(f)
	}

	return result
}

//go:embed all:data
var excel embed.FS
var (
	MainFile = "BSM370 Conputer Interface.xlsx"
)

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// ตรวจสอบว่าไฟล์มีอยู่หรือไม่
	if _, err := os.Stat(MainFile); os.IsNotExist(err) {
		fmt.Println("Main file not found. Cloning from embed...")

		// อ่านไฟล์จาก embed
		data, err := fs.ReadFile(excel, filepath.Join("data", MainFile))
		if err != nil {
			fmt.Println("Failed to read embedded file:", err)
			return
		}

		// เขียนไฟล์ไปยังไฟล์จริง
		err = os.WriteFile(MainFile, data, 0644)
		if err != nil {
			fmt.Println("Failed to write file to disk:", err)
			return
		}

		fmt.Println("File cloned successfully.")
	} else {
		fmt.Println("Main file already exists.")
	}

	f, err := excelize.OpenFile(MainFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	// check the data sheet
	found := false
	for _, s := range f.GetSheetList() {
		if s == "data" {
			found = true
			break
		}
	}
	fmt.Println("found", found)
	if !found {
		if _, err := f.NewSheet("data"); err != nil {
			log.Fatal(err)
		}
	}

	docs := Docs{
		result: make(chan Result),
		ctx:    ctx,
		f:      f,
	}

	a.docs = &docs
	go docs.run()
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
			// fmt.Println("message : ", string(message))
			// msg := strings.Split(string(message), string([]byte{0x1B}))
			// fmt.Println("msg", msg)
			// fmt.Println("new message comming")
			// log.Println(message)
			fmt.Println(string(message))
			msg := strings.Split(string(message), string(rune(0x1B)))

			if len(msg) != 5 {
				return
			}
			var dataPipe []string = strings.Split(msg[4], string(rune(0x1A)))

			if len(dataPipe) != 7 {
				fmt.Println("len datapipe", len(dataPipe))
				return
			}
			result := hexToFloat(dataPipe[:6])
			fmt.Println(result)
			fmt.Println(dataPipe)
			// fmt.Println(dataPipe)
			a.result <- result

		case result := <-a.result:
			runtime.EventsEmit(a.ctx, "result", result)
			res := Result{
				Height: result[3],
				Weigth: result[0],
				BMI:    result[1],
			}
			a.docs.result <- res

		case <-a.ctx.Done():
			return
		}
	}
}

func (a *App) SelectMonitor(port string, mode serial.Mode) {
	fmt.Println("mode", mode)
	ctx, cancel := context.WithCancel(a.ctx)
	monitor := &Monitor{
		ID:     uuid.New(),
		ctx:    ctx,
		cancel: cancel,
		Port:   port,
		mode:   mode,
	}
	a.selectMonitor <- monitor
	a.monitors[monitor.ID] = monitor
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
		log.Print(err)

		return
	}
	defer port.Close()

	buff := make([]byte, 1024)
	message := []byte{}
	for {
		n, err := port.Read(buff)
		if err != nil {
			log.Fatal(err)
		}
		if n == 0 {
			fmt.Println("\nEOF")
			break
		}

		// fmt.Printf("%v", string(buff[:n]))
		message = append(message, buff[:n]...)

		if strings.Contains(string(buff[:n]), string(byte(0x03))) {
			// fmt.Println(string(message))
			// fmt.Println(string(startMessage))
			fmt.Println(message)
			fmt.Println(startMessage)
			if bytes.Contains(message, startMessage) {
				fmt.Println("conditi")
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
