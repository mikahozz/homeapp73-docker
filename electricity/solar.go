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
	startTime := time.Now()
	requestURL := r.URL.String()
	log.Printf("Request received: %s %s", r.Method, requestURL)

	// Create a custom response writer to capture status code
	rw := newResponseWriter(w)

	defer func() {
		duration := time.Since(startTime)
		log.Printf("Request completed: %s %s, status: %d, duration: %v", r.Method, requestURL, rw.statusCode, duration)
	}()

	client := influxdb2.NewClient("http://influxdb:8086", "")
	queryAPI := client.QueryAPI("")
	result, err := queryAPI.Query(context.Background(),
		`from(bucket:"homedb")|> range(start: -5d) 
		|> filter(fn: (r) => r._measurement == "electricity")
		|> filter(fn: (r) => r._field == "OutputActivePowerW")`)
	if err != nil {
		log.Printf("Error querying InfluxDB: %v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte(fmt.Sprintf("Could not get Solar: %s", err)))
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
			if datetime.After(datetime.Add(time.Duration(time.Duration.Minutes(60)))) {
				power = PowerGeneration{
					DateTime: &datetime,
					PowerW:   record.Value().(float64),
				}
			}
		}
		output, err := json.MarshalIndent(power, "", "  ")
		if err != nil {
			log.Printf("Error marshaling JSON: %v", err)
			rw.WriteHeader(http.StatusInternalServerError)
			rw.Write([]byte(fmt.Sprintf("Error converting data to json: %v", err)))
			return
		}

		// Log the output as a separate event
		log.Printf("Response data: %s", string(output))

		rw.Header().Set("Content-Type", "application/json")
		rw.WriteHeader(http.StatusOK)
		rw.Write(output)
	}
}

// Custom response writer to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{w, http.StatusOK}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
