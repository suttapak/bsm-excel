package main

import (
	"math"
)

type (
	Filter struct {
		Limit        int    `json:"limit" query:"limit"`
		Offset       int    `json:"-"`
		Page         int    `json:"page,omitempty" query:"page"`
		NextPage     int    `json:"next_page,omitempty"`
		PreviousPage int    `json:"previous_page,omitempty"`
		Count        int64  `json:"count"`
		TotalPage    int    `json:"total_page"`
		Search       string `json:"search,omitempty"`
		OrderBy,
		Order string
	}
)

func (m *Filter) Validate() bool {
	if m.OrderBy == "" || m.Order == "" {
		return false
	}
	var validOrder = map[string]bool{
		"weight":     true,
		"height":     true,
		"bmi":        true,
		"created_at": true,
		"id":         true,
	}
	if !validOrder[m.OrderBy] {
		return false
	}
	// if m.Order != "ascending" && m.Order != "descending" {
	if m.Order != "ASC" && m.Order != "DESC" {
		return false
	}

	return true
}

func (p *Filter) SetCount(count int64) {
	p.Count = count
	p.TotalPage = int(math.Ceil(float64(p.Count) / float64(p.Limit)))
	if p.Page > 1 {
		p.PreviousPage = p.Page - 1
	} else {
		p.PreviousPage = p.Page
	}
	if p.Page == p.TotalPage {
		p.NextPage = p.Page
	} else if p.Page > p.TotalPage {

		p.Page = p.TotalPage
	} else {
		p.NextPage = p.Page + 1
	}
}
func NewFilter(limit, page int, orderBy, order string) (filter *Filter) {
	if limit <= 0 {
		limit = 10
	}
	if page <= 0 {
		page = 1
	}
	if order == "ascending" {
		order = "ASC"
	}
	if order == "descending" {
		order = "DESC"
	}

	p := &Filter{
		Limit:   limit,
		Page:    page,
		Order:   order,
		OrderBy: orderBy,
	}

	p.Offset = (p.Page - 1) * p.Limit
	return p
}
