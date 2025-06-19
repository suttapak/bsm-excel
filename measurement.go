package main

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type (
	Measurement struct {
		gorm.Model
		FullName  string  `json:"full_name"`
		PatientID string  `json:"patient_id"`
		Weight    float32 `json:"weight"`
		Height    float32 `json:"height"`
		BMI       float32 `json:"bmi"`
	}

	FindAllRequest struct {
		Limit  int    `json:"limit"`
		Page   int    `json:"page"`
		Search string `json:"search"`
		SortBy string `json:"sort_by"`
		Sort   string `json:"sort"`
	}

	MeasurementService struct {
		ctx    context.Context
		db     *gorm.DB
		logger AppLogger
	}

	MeasurementResponse[T any] struct {
		Data T      `json:"data"`
		Meta Filter `json:"meta"`
	}
)

func NewMeasurement(logger AppLogger) (m *MeasurementService, err error) {
	m = &MeasurementService{
		logger: logger,
	}
	ex, err := os.Executable()
	if err != nil {
		logger.Error(err)
		return nil, err
	}
	dsn := filepath.Join(filepath.Dir(ex), "measurement.db")
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	db.AutoMigrate(&Measurement{})
	m.db = db
	return
}

func (m *MeasurementService) start(ctx context.Context) {
	m.ctx = ctx
}

func (m *MeasurementService) Create(result *Measurement) error {
	return m.db.Create(&result).Error
}

func (m *MeasurementService) Update(id uint, result *Measurement) error {
	return m.db.Where("id = ?", id).Updates(&result).Error
}

func (m *MeasurementService) Delete(id uint) error {
	return m.db.Delete(&Measurement{}, id).Error
}

func (m *MeasurementService) UpdatePatienID(id uint, pId string) error {

	var model Measurement = Measurement{}
	m.db.Where("patient_id = ?", pId).First(&model)

	if err := m.db.Model(&Measurement{}).Where("id = ?", id).Update("patient_id", pId).Error; err != nil {
		return err
	}

	return m.db.Model(&Measurement{}).Where("patient_id = ?", id).Update("full_name", model.FullName).Error
}

func (m *MeasurementService) UpdatePatienName(id string, name string) error {
	return m.db.Model(&Measurement{}).Where("patient_id = ?", id).Update("full_name", name).Error
}

func (m *MeasurementService) FindAll(req *FindAllRequest) (res MeasurementResponse[[]Measurement], err error) {
	var (
		count  int64 = 0
		filter       = NewFilter(req.Limit, req.Page, req.SortBy, req.Sort)
		models       = []Measurement{}
	)

	query := m.db.Model(&Measurement{})
	if filter.Validate() {
		query.Order(filter.OrderBy + " " + filter.Order)
	} else {
		query = query.Order("created_at desc")
	}

	if req.Search != "" {
		query = query.Scopes(ILike("patient_id", req.Search))
	}
	query = query.Count(&count)
	filter.SetCount(count)

	err = query.Offset(filter.Offset).Limit(filter.Limit).Find(&models).Error
	res = MeasurementResponse[[]Measurement]{
		Data: models,
		Meta: *filter,
	}
	return
}

func (m *MeasurementService) Find(date time.Time) ([]Measurement, error) {
	var res []Measurement

	err := m.db.
		Where("date(created_at) = ?", date.Local().Format("2006-01-02")).
		Find(&res).Error

	return res, err
}

func ILike(column, value string) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("LOWER("+column+") LIKE LOWER(?)", "%"+value+"%")
	}
}

func (m *MeasurementService) FindByID(pid string) ([]Measurement, error) {
	var res []Measurement

	err := m.db.
		Where("patient_id = ?", pid).
		Find(&res).Error

	return res, err
}
