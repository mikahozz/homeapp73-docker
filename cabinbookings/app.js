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

        let db = new Mysql({
            host: "mariadb",
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD
        });
        bookings = [];
        var days = parseInt(req.params.amountOfDays);
        if(isNaN(days)) {
            throw Error("Provided parameter is not a number: " + req.params.amountOfDays);
        }

        db.queryWithParams("SELECT date, booked, created, updated from cabok_db.bookings WHERE date BETWEEN CURDATE() AND CURDATE() + INTERVAL ? DAY", [days])
        .then(rows => {
            res.writeHead(200, {"Content-Type": "application/json"});
            rows.forEach((item) => {
                bookings.push({'date': item.date, 'booked': item.booked, 'created': item.created, 'updated': item.updated});
            });
            res.write(JSON.stringify(bookings));
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
