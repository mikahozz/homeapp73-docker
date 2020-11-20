from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://raspberrypi.local:3000", "http://localhost:3000", "http://localhost:8080"]}})

import indoor
import outdoor
import outdoorhistory

@app.route("/")
def home():
    return render_template("index.html")
