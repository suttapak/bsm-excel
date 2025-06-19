package main

import (
	"context"
	"embed"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/xuri/excelize/v2"
)

type Exporter struct {
	measurementService *MeasurementService
	logger             AppLogger
	ctx                context.Context
	conf               *Config
}

func NewExporter(measurementService *MeasurementService, logger AppLogger, conf *Config) *Exporter {
	return &Exporter{
		measurementService: measurementService,
		logger:             logger,
		conf:               conf,
	}
}
func (e *Exporter) SetContext(ctx context.Context) {
	e.ctx = ctx
}

// empty file excel
//
//go:embed defaul.xlsx
var excelFile embed.FS

func ensureExcelFile() error {
	ex, err := os.Executable()
	if err != nil {
		return err
	}
	path := filepath.Join(filepath.Dir(ex), "defaul.xlsx")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// read the embedded file
		// clone the embedded file to the executable directory
		data, err := excelFile.ReadFile("defaul.xlsx")
		if err != nil {
			return err
		}
		// create the file in the executable directory
		file, err := os.Create(path)
		if err != nil {
			return err
		}
		defer file.Close()
		// write the data to the file
		_, err = file.Write(data)
		if err != nil {
			return err
		}
	}
	return nil
}

func (e *Exporter) ExportPatientToExcel(patientId string) error {

	data, err := e.measurementService.FindByID(patientId)
	if err != nil {
		e.logger.Error("Failed to fetch measurements" + err.Error())
		return err
	}
	fmt.Println("Fetched data:", data)
	if err := ensureExcelFile(); err != nil {
		e.logger.Error("Failed to ensure excel file: " + err.Error())
		return err
	}

	ex, err := os.Executable()
	if err != nil {
		e.logger.Error("Failed to get executable path: " + err.Error())
		return err
	}
	filePath := filepath.Join(filepath.Dir(ex), "defaul.xlsx")

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		e.logger.Error("Failed to open excel file: " + err.Error())
		return err

	}
	defer f.Close()
	rowStart := 10
	f.SetCellValue("Result (2)", fmt.Sprintf("C%d", 5), e.conf.Name)
	f.SetCellValue("Result (2)", fmt.Sprintf("C%d", 6), e.conf.Department)
	for _, measurement := range data {
		if measurement.PatientID != "" {
			f.SetCellValue("Result (2)", fmt.Sprintf("D%d", 3), measurement.PatientID)

		}
		if measurement.FullName != "" {
			f.SetCellValue("Result (2)", fmt.Sprintf("D%d", 4), measurement.FullName)

		}

		f.SetCellValue("Result (2)", fmt.Sprintf("A%d", rowStart), measurement.ID)
		f.SetCellValue("Result (2)", fmt.Sprintf("B%d", rowStart), measurement.CreatedAt.Format(time.DateOnly))
		f.SetCellValue("Result (2)", fmt.Sprintf("C%d", rowStart), measurement.CreatedAt.Format(time.TimeOnly))
		f.SetCellValue("Result (2)", fmt.Sprintf("D%d", rowStart), measurement.PatientID)
		f.SetCellValue("Result (2)", fmt.Sprintf("E%d", rowStart), measurement.Weight)
		f.SetCellValue("Result (2)", fmt.Sprintf("F%d", rowStart), measurement.Height)
		f.SetCellValue("Result (2)", fmt.Sprintf("G%d", rowStart), measurement.BMI)
		rowStart++
	}
	option := runtime.SaveDialogOptions{
		Title:           "บันทึกไฟล์",
		DefaultFilename: fmt.Sprintf("ผลลัพธ์-%s.xlsx", patientId),
	}
	savePath, err := runtime.SaveFileDialog(e.ctx, option)
	if err != nil {
		e.logger.Error("Failed to open save dialog: " + err.Error())
		return err
	}

	if err := f.SaveAs(savePath); err != nil {
		e.logger.Error("Failed to save excel file: " + err.Error())
		return err
	}

	return nil
}

func (e *Exporter) ExportToExcel(date string) error {
	condition := time.Now()
	fmt.Println("Exporting to Excel with date:", date)
	if date != "" {
		if parseTime, err := time.Parse(time.RFC3339, date); err == nil {
			condition = parseTime
		}
	}
	data, err := e.measurementService.Find(condition)
	if err != nil {
		e.logger.Error("Failed to fetch measurements" + err.Error())
		return err
	}
	fmt.Println("Fetched data:", data)
	if err := ensureExcelFile(); err != nil {
		e.logger.Error("Failed to ensure excel file: " + err.Error())
		return err
	}

	ex, err := os.Executable()
	if err != nil {
		e.logger.Error("Failed to get executable path: " + err.Error())
		return err
	}
	filePath := filepath.Join(filepath.Dir(ex), "defaul.xlsx")

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		e.logger.Error("Failed to open excel file: " + err.Error())
		return err

	}
	defer f.Close()
	rowStart := 8
	for _, measurement := range data {
		f.SetCellValue("Result", fmt.Sprintf("A%d", rowStart), measurement.ID)
		f.SetCellValue("Result", fmt.Sprintf("B%d", rowStart), measurement.CreatedAt.Format(time.DateOnly))
		f.SetCellValue("Result", fmt.Sprintf("C%d", rowStart), measurement.CreatedAt.Format(time.TimeOnly))
		f.SetCellValue("Result", fmt.Sprintf("D%d", rowStart), measurement.PatientID)
		f.SetCellValue("Result", fmt.Sprintf("E%d", rowStart), measurement.Weight)
		f.SetCellValue("Result", fmt.Sprintf("F%d", rowStart), measurement.Height)
		f.SetCellValue("Result", fmt.Sprintf("G%d", rowStart), measurement.BMI)
		rowStart++
	}
	option := runtime.SaveDialogOptions{
		Title:           "บันทึกไฟล์",
		DefaultFilename: "ผลลัพธ์.xlsx",
	}
	savePath, err := runtime.SaveFileDialog(e.ctx, option)
	if err != nil {
		e.logger.Error("Failed to open save dialog: " + err.Error())
		return err
	}

	if err := f.SaveAs(savePath); err != nil {
		e.logger.Error("Failed to save excel file: " + err.Error())
		return err
	}

	return nil
}
