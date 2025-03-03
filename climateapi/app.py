from flask import Flask, render_template, request, g
from flask_cors import CORS
import time
import datetime

app = Flask(__name__)
cors = CORS(
    app,
    resources={
        r"/*": {"origins": ["http://raspberrypi.local:3000", "http://localhost:3000", "http://localhost:8080"]}
    },
)

import indoor
import outdoor
import outdoorhistory


@app.before_request
def before_request():
    g.start_time = time.time()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] Request started: {request.method} {request.path} {request.remote_addr}")


@app.after_request
def after_request(response):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    duration = time.time() - g.start_time
    print(
        f"[{timestamp}] Request completed: {request.method} {request.path} - Status: {response.status_code} - Duration: {duration:.4f}s"
    )
    return response


@app.route("/")
def home():
    return render_template("index.html")
