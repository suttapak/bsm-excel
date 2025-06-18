package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

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
		ctx context.Context
		db  *gorm.DB
	}

	MeasurementResponse[T any] struct {
		Data T      `json:"data"`
		Meta Filter `json:"meta"`
	}
)

func NewMeasurement() (m *MeasurementService) {
	m = &MeasurementService{}
	ex, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	dsn := filepath.Join(filepath.Dir(ex), "measurement.db")
	fmt.Println("dsh", dsn)
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
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
	return m.db.Model(&Measurement{}).Where("id = ?", id).Update("patient_id", pId).Error
}

func (m *MeasurementService) FindAll(req *FindAllRequest) (res MeasurementResponse[[]Measurement], err error) {
	var (
		count  int64 = 0
		filter       = NewFilter(req.Limit, req.Page, req.SortBy, req.Sort)
		models       = []Measurement{}
	)

	fmt.Println("filter", filter)
	query := m.db.Model(&Measurement{})
	if filter.Validate() {
		fmt.Println("1")
		query.Order(filter.OrderBy + " " + filter.Order)
	} else {
		fmt.Println("2")
		query = query.Order("created_at desc")
	}

	if req.Search != "" {
		fmt.Println("4")
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

func ILike(column, value string) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("LOWER("+column+") LIKE LOWER(?)", "%"+value+"%")
	}
}
