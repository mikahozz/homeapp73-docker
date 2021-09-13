const express = require('express');
const Mysql = require('./mysql.js');
require('dotenv').config();
const app = express();
const port = 3011;

app.get('/', (req, res) => {
    let db = new Mysql({
        host: "mariadb",
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD
    });
    bookings = [];
    db.query("SELECT date, booked, created, updated from cabok_db.bookings")
    .then(rows => {
        res.writeHead(200, {"Content-Type": "application/json"});
        rows.forEach((item) => {
            bookings.push({'date': item.date, 'booked': item.booked, 'created': item.created, 'updated': item.updated});
        });
        res.write(JSON.stringify(bookings));
        res.end();
    })
    .finally(() => {
        db.close();    
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
