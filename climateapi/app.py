from flask import Flask, render_template
app = Flask(__name__)

import indoor
import outdoor

@app.route("/")
def home():
    return render_template("index.html")
