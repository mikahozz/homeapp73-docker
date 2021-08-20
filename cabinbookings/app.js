const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3011;

app.get('/', (req, res) => {
    let db = new sqlite3.Database('./data/cabinbookings.db', (err) => {
        if(err) {
            throw Error ('Could not connect to database' + err.message);
        }
        bookings = []
        res.writeHead(200, {"Content-Type": "application/json"});
        db.each("select datetime(date, 'unixepoch') as date, booked, datetime(updated, 'unixepoch') as updated from bookings WHERE datetime(date, 'unixepoch') < DATETIME('now', '+1 month')", 
        (err, result) => {
            if(err) {
                throw err;
            }
            console.log(result.booked);
            bookings.push({'date': result.date, 'booked': result.booked, 'updated': result.updated});
        }, 
        (err, num) => {
            if(err) {
                throw err;
            }
            res.write(JSON.stringify(bookings));
            db.close();
            res.end();
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
