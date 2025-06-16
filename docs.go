package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/xuri/excelize/v2"
)

type Docs struct {
	result chan Result
	ctx    context.Context
	f      *excelize.File
}

func (d *Docs) run() {
	for {
		select {
		case result := <-d.result:

			fmt.Println("result", result)
			rows, err := d.f.GetRows("data")
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println("row", rows)
			if err := d.f.SetCellValue("data", fmt.Sprintf("A%d", len(rows)+1), result.Height); err != nil {
				log.Fatal(err)
			}
			if err := d.f.SetCellValue("data", fmt.Sprintf("B%d", len(rows)+1), result.Weigth); err != nil {
				log.Fatal(err)
			}
			if err := d.f.SetCellValue("data", fmt.Sprintf("C%d", len(rows)+1), result.BMI); err != nil {
				log.Fatal(err)
			}
			if err := d.f.SetCellValue("data", fmt.Sprintf("D%d", len(rows)+1), time.Now().Format(time.DateTime)); err != nil {
				log.Fatal(err)
			}
			if err := d.f.Save(); err != nil {
				log.Fatal(err)
			}

		case <-d.ctx.Done():
			close(d.result)
			return
		}
	}
}

func (d *Docs) Save() error {
	panic("")
}
