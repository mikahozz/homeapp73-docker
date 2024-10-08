from flask import Flask, jsonify
from flask_cors import CORS
import datetime as dt
import json
import caldav
import sys
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": ["http://raspberrypi.local:3000", "http://localhost:3000", "http://192.168.10.217"]}})


def myconverter(o):
    if isinstance(o, dt.datetime):
        return o.__str__()


@app.route("/api/events")
def home():
    sys.path.insert(0, '..')

    url = os.getenv('CALENDAR_URL')
    username = os.getenv('CAL_USERNAME')
    password = os.getenv('CAL_PASSWORD')
    client = caldav.DAVClient(url=url, username=username, password=password)
    my_principal = client.principal()
    calendars = my_principal.calendars()
    if calendars:
        events_fetched = calendars[0].date_search(
            start=dt.datetime.utcnow(), end=dt.datetime.utcnow() + dt.timedelta(days=7), expand=True)

        events = []
        for x in events_fetched:
            if not hasattr(x.vobject_instance.vevent, "exdate") or x.vobject_instance.vevent.dtstart.value not in x.vobject_instance.vevent.exdate.value:
                events.append({
                    'uid': x.vobject_instance.vevent.uid.value,
                    'start': x.vobject_instance.vevent.dtstart.value,
                    'end': x.vobject_instance.vevent.dtend.value,
                    'summary': x.vobject_instance.vevent.summary.value})

        return jsonify(events)
