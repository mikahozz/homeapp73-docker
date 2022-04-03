package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api/query"
)

type PowerGeneration struct {
	DateTime *time.Time `json:"datetime,omitempty"`
	PowerW   float64    `json:"powerw"`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/solar/current", getCurrentSolar)
	log.Fatal(http.ListenAndServe(":3016", mux))
}

func getCurrentSolar(w http.ResponseWriter, r *http.Request) {
	client := influxdb2.NewClient("http://influxdb:8086", "")
	queryAPI := client.QueryAPI("")
	result, err := queryAPI.Query(context.Background(),
		`from(bucket:"homedb")|> range(start: -5d) 
		|> filter(fn: (r) => r._measurement == "electricity")
		|> filter(fn: (r) => r._field == "OutputActivePowerW")`)
	if err != nil {
		w.Write([]byte(fmt.Sprintf("Could not get Solar: %s", err)))

	} else {
		record := new(query.FluxRecord)
		for result.Next() {
			record = result.Record()
		}
		var power PowerGeneration
		if record.Value() == nil {
			power = PowerGeneration{
				PowerW: 0,
			}
		} else {
			datetime := time.UnixMilli(record.Time().UnixMilli()).UTC()
			power = PowerGeneration{
				DateTime: &datetime,
				PowerW:   record.Value().(float64),
			}
		}
		output, err := json.MarshalIndent(power, "", "  ")
		if err != nil {
			w.Write([]byte(fmt.Sprintf("Error converting data to json: %v", err)))
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(output)
	}
}
