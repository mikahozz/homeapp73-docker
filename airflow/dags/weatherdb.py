import datetime as dt
import requests
import json
from influxdb import InfluxDBClient

def fetch():
    client = InfluxDBClient(host='raspberrypi.local', port=8086)
    client.switch_database('homedb')
    results = client.query('SELECT LAST(t2m) FROM climate')

    resultgen = results.get_points()
    start_date = dt.datetime.utcnow() - dt.timedelta(days=6)
    for value in resultgen:
        time = dt.datetime.strptime(value['time'], '%Y-%m-%dT%H:%M:%SZ')
        start_date = time + dt.timedelta(minutes=5)
        print('The latest value is ', time)
        break
    start_date = dt.datetime.strftime(start_date, '%Y-%m-%dT%H:%M:%SZ')
    print(start_date)
    url = "http://raspberrypi.local:5011/outdoor?start_date={0}&location={1}".format(start_date, "Kumpula")
    print(url)
    x = requests.get(url)
    headers    = ['dt', 'rh', 'td', 'r_1h', 'ri_10min']
    jsondata = json.loads(x.content)
    data = []
    for row in jsondata:
        value = []
        timestamp = row['dt']
        for col in row.items():
            if col[1] is not None and col[0] != 'dt':
                value.append('{0}={1}'.format(col[0], col[1]))
        data.append('climate,location=Kumpula {data} {time}'.format(data=','.join(value), time=timestamp))
    client.write_points(data, time_precision='ms', protocol='line')
