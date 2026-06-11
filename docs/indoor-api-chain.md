# Indoor Climate API — Full Data Chain

## Overview

The `/api/indoor/<device>` endpoint returns the latest temperature, humidity, and battery reading for a named indoor sensor. The data flows through five hops:

```
Zigbee sensor → Zigbee2MQTT → Mosquitto (MQTT) → mqttclient → InfluxDB → climateapi → nginx → client
```

---

## 1. Physical Sensor (Zigbee device)

Known devices:

| Friendly name    | IEEE address           | Notes                          |
|------------------|------------------------|--------------------------------|
| `dev_upstairs`   | `0x00158d00068b39cb`   | Zigbee temp/humidity/battery   |
| `dev_downstairs` | `0x00124b00226b11bc`   | Zigbee temp/humidity/battery   |

Sensors transmit Zigbee radio packets roughly every 10–15 minutes. Battery is usually 100 % and linkquality around 78 when healthy.

---

## 2. Zigbee2MQTT (container: `zigbee2mqtt`)

Image: `koenkk/zigbee2mqtt:2.11.0`  
Config: `zigbee2mqtt/configuration.yaml`  
USB dongle: `/dev/ttyACM0` (ZStack12 coordinator, IEEE `0x00124b001ccc6707`)

When a sensor reports, Zigbee2MQTT publishes a JSON payload to MQTT:

```
topic:   zigbee2mqtt/dev_upstairs
payload: {"battery":100,"humidity":54.56,"linkquality":78,"pressure":1008,"temperature":23.87,"voltage":3045}
```

**Health check:** The bridge publishes to `zigbee2mqtt/bridge/health` every 10 minutes.  
The `devices` object inside shows a message counter per IEEE address — useful for confirming a device is alive:
```json
"devices": {"0x00158d00068b39cb": {"messages": 113, "messages_per_sec": 0.0015}}
```

### Common failure: interview failed

If a device loses pairing (after a Z2M restart, upgrade, or prolonged absence), Z2M logs:

```
Interview failed for '0x00158d00068b39cb' with error
'Error: Interview failed because can not get node descriptor'
```

When this happens the device shows `"interview_state":"FAILED"` in `zigbee2mqtt/bridge/devices` and the definition is auto-generated with only `linkquality` exposed. **No temperature/humidity data is published.** InfluxDB stops receiving new rows for that location.

**Fix — try re-interview first (no physical access):**
```bash
docker exec mosquitto mosquitto_pub \
  -t "zigbee2mqtt/bridge/request/device/interview" \
  -m '{"id": "dev_upstairs"}'
```

**Fix — full re-pair (if re-interview fails):**
```bash
# Enable permit-join for 60 s
docker exec mosquitto mosquitto_pub \
  -t "zigbee2mqtt/bridge/request/permit_join" \
  -m '{"value": true, "time": 60}'

# Then press the physical pair button on the sensor, then watch:
docker logs -f zigbee2mqtt 2>&1 | grep -i "upstairs\|interview"
```

---

## 3. Mosquitto (container: `mosquitto`)

Plain MQTT broker on port 1883. No authentication in current config.

**Useful debugging commands (run inside the container):**
```bash
# See all zigbee device messages live (strips bridge noise)
docker exec mosquitto mosquitto_sub -t "zigbee2mqtt/#" -v \
  | grep -v "bridge/health\|bridge/logging\|bridge/info\|bridge/converters\|bridge/devices\|bridge/groups"

# Wait for a single message from one device (sensor reports ~every 12 min, so use -W 900)
docker exec mosquitto mosquitto_sub -t "zigbee2mqtt/dev_upstairs" -W 900 -v
```

---

## 4. mqttclient (container: `mqttclient`)

Source: `mqttclient/receiver.py`  
Subscribes to `#` (all topics).

**Zigbee path** — topics matching `zigbee2mqtt/dev_*`:
1. Parses the JSON payload.
2. Derives the device name from the last segment of the topic.
3. Writes every key-value pair as InfluxDB line protocol:
   ```
   indoorclimate,location=dev_upstairs battery=100,humidity=54.56,linkquality=78,pressure=1008,temperature=23.87,voltage=3045
   ```

**Shelly HT path** — topics under `shellymqtt/shellyht-*/`:  
Collects `temperature`, `humidity`, and `battery` separately; writes when all three have arrived:
```
indoorclimate,location=Shelly temperature=19.00,humidity=74.5,battery=89
```

**Debugging:**
```bash
docker logs mqttclient --tail 100
# Look for "Writing to database:" lines and "Exception in message handling:" lines
```

---

## 5. InfluxDB (container: `influxdb`)

Image: `influxdb:1.8.10`  
Database: `homedb`  
Measurement: `indoorclimate`  
Tag key: `location`  
Field keys: `temperature`, `humidity`, `battery`, `linkquality`, `pressure`, `voltage`

**Check freshness per device:**
```bash
docker exec influxdb influx -database homedb \
  -execute "SELECT * FROM indoorclimate WHERE location='dev_upstairs' ORDER BY time DESC LIMIT 5"
```

**Check all known locations:**
```bash
docker exec influxdb influx -database homedb \
  -execute "SHOW TAG VALUES FROM indoorclimate WITH KEY = location"
```

If the most recent timestamp is older than ~30 minutes, the problem is upstream (sensor, Z2M, or mqttclient). Convert a nanosecond timestamp to a date:
```bash
python3 -c "import datetime; print(datetime.datetime.utcfromtimestamp(<ts_ns> / 1e9))"
```

---

## 6. climateapi (container: `climateapi`)

Source: `climateapi/app.py`, `climateapi/indoor.py`  
Port: 5011  
Framework: Python 3.6 + Flask + gunicorn

Route handler (`indoor.py`):
```python
@app.route("/api/indoor/<device>")
def indoor(device):
    client = InfluxDBClient(host="influxdb", port=8086)
    client.switch_database("homedb")
    results = client.query(
        f"SELECT LAST(temperature),* FROM indoorclimate where location = '{device}'"
    )
    # returns {"time", "temperature", "humidity", "battery"}
```

The query uses `SELECT LAST(temperature),*` — it returns the single row whose `temperature` field is most recent. If no rows exist for the given device, the response is `{}`.

**Debugging:**
```bash
docker logs climateapi --tail 50
curl http://localhost:5011/api/indoor/dev_upstairs
```

---

## 7. nginx (container: `nginx`)

Routing rules (from `nginx/` config):

| Path prefix      | Upstream                  |
|------------------|---------------------------|
| `/api/indoor/`   | `climateapi:5011`         |
| `/api`           | `villa73 Go API:6001`     |
| `/`              | `villa73 web:3000`        |

> **Note:** The villa73 Go API (`villa73/backend/cmd/api/main.go`) also defines a route for `/api/indoor/dev_upstairs`, but it returns **hardcoded mock data** (`temperature=22.5, humidity=27.4`). That route is unreachable in production because nginx forwards `/api/indoor/` to `climateapi` before it can hit the Go API.

---

## Debugging checklist when `/api/indoor/dev_upstairs` returns stale data

1. **Check InfluxDB** — is the data stale there?
   ```bash
   docker exec influxdb influx -database homedb \
     -execute "SELECT * FROM indoorclimate WHERE location='dev_upstairs' ORDER BY time DESC LIMIT 3"
   ```
   - If timestamp is recent → problem is in climateapi or nginx. Check `docker logs climateapi`.
   - If timestamp is old → continue below.

2. **Check if Zigbee2MQTT sees the device:**
   ```bash
   docker logs zigbee2mqtt --tail 50 2>&1 | grep -i "upstairs\|interview\|error"
   ```
   - `"interview_state":"FAILED"` → re-pair the device (see §2 above).
   - Device missing from logs entirely → check physical device (battery, proximity to coordinator).

3. **Check MQTT messages arriving:**
   ```bash
   docker exec mosquitto mosquitto_sub -t "zigbee2mqtt/dev_upstairs" -W 900 -v
   ```
   Wait up to 15 minutes for a message. If nothing arrives, the problem is the sensor or Z2M.

4. **Check mqttclient is writing:**
   ```bash
   docker logs mqttclient --tail 200 | grep -i "dev_upstairs\|Exception"
   ```
   Missing "Writing to database:" lines with `dev_upstairs` → exception or parsing error in `receiver.py`.
