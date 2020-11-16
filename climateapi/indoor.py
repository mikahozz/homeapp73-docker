from app import app
from influxdb import InfluxDBClient, DataFrameClient
import datetime as dt
from flask import jsonify

@app.route("/indoor")
def indoor():
    client = InfluxDBClient(host='influxdb', port=8086)
    client.switch_database('homedb')
    results = client.query('SELECT LAST(temperature),* FROM indoorclimate')

    resultgen = results.get_points()
    response = {}
    for value in resultgen:
        print(x for x in value.keys())
        date = dt.datetime.strptime(value['time'], '%Y-%m-%dT%H:%M:%S.%fZ')
        temperature = value['temperature']
        humidity = value['humidity']
        battery = value['battery']
        response = { 'time': value['time'],
            'temperature': value['temperature'], 
            'humidity': value['humidity'],
            'battery': value['battery']
            }
        print('Response ', response)
        break

    return jsonify(response)
