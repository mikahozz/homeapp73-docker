from flask import Flask, render_template, request, g
from flask_cors import CORS
import time
import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
logger = logging.getLogger(__name__)

app = Flask(__name__)
cors = CORS(
    app,
    resources={
        r"/*": {"origins": ["http://raspberrypi.local:3000", "http://localhost:3000", "http://localhost:8080"]}
    },
)

import indoor

# import outdoor
# import outdoorhistory


@app.before_request
def before_request():
    g.start_time = time.time()
    logger.info(f"Request started: {request.method} {request.path} {request.remote_addr}")


@app.after_request
def after_request(response):
    if hasattr(g, "start_time"):
        duration = time.time() - g.start_time
        logger.info(
            f"Request completed: {request.method} {request.path} - Status: {response.status_code} - Duration: {duration:.4f}s"
        )
    else:
        logger.info(f"Request completed: {request.method} {request.path} - Status: {response.status_code}")
    return response


@app.route("/")
def home():
    return render_template("index.html")
