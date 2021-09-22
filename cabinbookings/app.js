const express = require('express');
const Mysql = require('./mysql.js');
require('dotenv').config();
const app = express();
const port = 3011;

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

app.get('/days/:amountOfDays', (req, res) => {
    try {
        if(!process.env.DBUSER || !process.env.DBPASSWORD) {
            throw Error("DBUSER or DBPASSWORD not provided");
        }
        let db = new Mysql({
            host: "mariadb",
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD
        });
        let bookingRes = {
            lastupdated: null,
            bookings: []
        }
        let days = parseInt(req.params.amountOfDays);
        if(isNaN(days)) {
            throw Error("Provided parameter is not a number: " + req.params.amountOfDays);
        }
        db.query("SELECT MAX(runfinished) as runfinished FROM cabok_db.runs")
        .then(async row => {
            bookingRes.lastupdated = row[0].runfinished;
            let rows = await db.queryWithParams("SELECT date, booked, created, updated from cabok_db.bookings WHERE date BETWEEN CURDATE() AND CURDATE() + INTERVAL ? DAY", [days])
            rows.forEach((item) => {
                bookingRes.bookings.push({'date': item.date, 'booked': item.booked, 'created': item.created, 'updated': item.updated});
            });
            let jsonRes = JSON.stringify(bookingRes);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(jsonRes);
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err.message);
        })
        .finally(() => {
            db.close().catch(err => {});    // Ingore potential errors on db.close
        })
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
