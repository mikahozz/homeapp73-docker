from app import app
import datetime as dt
from influxdb import InfluxDBClient
import pandas as pd
from flask import Flask, request, jsonify, Response

@app.route("/outdoor/history/<location>/<int:days>")
def outdoorhistory(location, days):

    startTime = (dt.datetime.utcnow() - dt.timedelta(days = days)).isoformat(timespec='seconds') + 'Z'
    print(f'Fetching weather history for {location} from {startTime}', flush=True)
    client = InfluxDBClient(host='influxdb', port=8086)
    client.switch_database('homedb')
    query = f'SELECT *::field FROM climate WHERE location = $location AND time >= $time'
    results = client.query(query, params=None, bind_params={'location': location, 'time': startTime})
    df = pd.DataFrame(results.get_points())
    df = df.rename(columns={'time': 'dt'})
    print(df.head())

    return Response(df.to_json(orient='records'), mimetype='application/json')

