from InverterData import Inverter
from influxdb import InfluxDBClient
import time

def writeentry(data):
    print("Writing to database: " + data)
    client = InfluxDBClient(host='influxdb', port=8086)
    client.switch_database('homedb')
    client.write_points(data, time_precision='ms', protocol='line')

inverter = Inverter()

while True:
    try:
        data = inverter.GetData()
        if data:
            influxdata = f"electricity,location=Solar "
            values = []
            values.append(f"InverterStatus=\"{data['Inverter status']}\"")
            values.append(f"TotalProductionKWh={data['Total production (kWh)']}")
            values.append(f"TodayProductionWh={data['Today production (Wh)']}")
            values.append(f"PV1PowerW={data['PV1 Power (W)']}")
            values.append(f"PV2PowerW={data['PV2 Power (W)']}")
            values.append(f"OutputActivePowerW={data['Output active power (W)']}")
            influxdata += ','.join(values)
            writeentry(influxdata)
            time.sleep(60)
        else:
            time.sleep(60*10)
    except Exception as e:
        print(f"Exception occurred: {e}")
        time.sleep(60*10)
    except:
        print("Exiting with unexpected error", sys.exc_info()[0])
        raise
