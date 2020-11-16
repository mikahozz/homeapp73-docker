from app import app
from fmiopendata.wfs import download_stored_query
import datetime as dt
import pandas as pd
from flask import Flask, request, jsonify, Response

@app.route("/outdoor")
def outdoor():
    location = request.args.get('location')

    # Handle date inputs
    if('start_date' in request.args):
        startTime = dt.datetime.strptime(request.args.get('start_date'), "%Y-%m-%dT%H:%M:%SZ")
        if(startTime > dt.datetime.utcnow()):
            return 'start_date cannot be in future'
        if('end_date' in request.args):
            endTime = dt.datetime.strptime(request.args.get('end_date'), "%Y-%m-%dT%H:%M:%SZ")
            if(startTime > endTime):
                return 'start_date cannot be greater than end_date'
        else:
            endTime = startTime + dt.timedelta(minutes=(6*24*60)-10)
    else:
        if('end_date' in request.args):
            endTime = dt.datetime.strptime(request.args.get('end_date'), "%Y-%m-%dT%H:%M:%SZ")
            if(endTime > dt.datetime.utcnow()):
                return 'end_date cannot be in future'
        else:
            endTime = dt.datetime.utcnow()
        startTime = endTime - dt.timedelta(minutes=(6*24*60)-10)

    startTime = startTime.isoformat(timespec="seconds") + "Z"
    endTime = endTime.isoformat(timespec="seconds") + "Z"
    print("Fetching weather data with values {} {} {}".format(location, startTime, endTime), flush=True)
    obs = download_stored_query("fmi::observations::weather::multipointcoverage",
                            args=["place=" + location,
                                  "starttime=" + startTime,
                                  "endtime=" + endTime,
                                  "timeseries=True"])

    #return jsonify(obs.data[list(obs.data.keys())[0]])

    location = list(obs.data.keys())[0]
    keys = obs.data[location]['times']
    temperature = obs.data[location]['t2m']['values']
    wind = obs.data[location]['ws_10min']['values']
    windHigh = obs.data[location]['wg_10min']['values']
    windDirection = obs.data[location]['wd_10min']['values']
    humidity = obs.data[location]['rh']['values']
    moistPoint = obs.data[location]['td']['values']
    precipitation  = obs.data[location]['r_1h']['values']
    precIntensity = obs.data[location]['ri_10min']['values']
    snowDept = obs.data[location]['snow_aws']['values']
    pressure = obs.data[location]['p_sea']['values']
    visibility = obs.data[location]['vis']['values']
    clouds = obs.data[location]['n_man']['values']
    weather = obs.data[location]['wawa']['values']

    df = pd.DataFrame({'dt': keys, 't2m': temperature, 'ws_10min': wind, 'wg_10min': windHigh, 'wd_10min': windDirection, 'rh': humidity, 'td': moistPoint, 'r_1h': precipitation, 'ri_10min': precIntensity, 'snow_aws': snowDept, 'p_sea': pressure, 'vis': visibility, 'n_man': clouds, 'wawa': weather })
    return Response(df.to_json(orient='records'), mimetype='application/json')

