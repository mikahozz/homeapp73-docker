import datetime as dt
from dateutil.parser import parse
import requests
import json
from influxdb import InfluxDBClient

def fetch(start_date, end_date, location):
    start = parse(start_date).strftime('%Y-%m-%dT%H:%M:%SZ')
    end = parse(end_date).strftime('%Y-%m-%dT%H:%M:%SZ')

    if(start == end):
        url = f'http://homeapp73-docker_climateapi_1:5011/outdoor?start_date={start}&location={location}'
    else:
        url = f'http://homeapp73-docker_climateapi_1:5011/outdoor?start_date={start}&end_date={end}&location={location}'
    print(url)
    x = requests.get(url)
    if(x.status_code != 200):
        raise ValueError('Error occurred in climate api: ', x.text); 
    jsondata = json.loads(x.content)
    data = []
    for row in jsondata:
        value = []
        timestamp = row['dt']
        for col in row.items():
            if col[1] is not None and col[0] != 'dt':
                value.append('{0}={1}'.format(col[0], col[1]))
        data.append('climate,location={location} {data} {time}'.format(location=location, data=','.join(value), time=timestamp))

    client = InfluxDBClient(host='influxdb', port=8086)
    client.switch_database('homedb')
    print('Writing {0} records into the db'.format(len(data)))
    print('Rows: ', '\r\n'.join(data))
    if(len(data) > 0):
        client.write_points(data, time_precision='ms', protocol='line')
