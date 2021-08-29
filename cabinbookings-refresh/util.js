const mysql = require('mysql');
require('dotenv').config();

function parseDate(datestr) {
    let date = null;
    if(datestr) {
        let re = new RegExp(/(\d{1,2}).(\d{1,2}).(\d{4})/);
        let m = re.exec(datestr);
        if(m) {
            date = new Date(m[3], m[2]-1, m[1], 16);       // Use 16 as the clock as then the reservations start
            if(date.getMonth() != m[2]-1 || date.getDate() != m[1]) {
                date = null;
            }
        }
    }
    return date;
}

function convertArray(array) {
    return (array) ? array
    .map(item => {
        parsedDate = toSimpleDate(parseDate(item.date), '-');
        return (parsedDate) ? parsedDate + "," + parseInt(item.booked) : null;
    })
    .filter(item => item != null)
    .join("\r\n")
     : null;
}

function toSimpleDate(date, delim = '') {
    if(!date) { return null; }
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
  
    return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join(delim);
}

function saveToDatabase(capacityJson, callback) {
    let con = mysql.createConnection({
        host: "mariadb",
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD
      });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        callback(1);
        con.end();
    });
    /*let db = new sqlite3.Database('./data/cabinbookings.db', (err) => {
        if(err) {
            console.error(err.message);
        }
        db.serialize( () => {
            db.run('CREATE TABLE IF NOT EXISTS bookings ' +
            '(date INTEGER PRIMARY KEY, booked INTEGER, updated INTEGER)');
            var sql = db.prepare('insert into bookings values (?,?,?) ON CONFLICT(date) ' +
            'DO UPDATE SET booked=excluded.booked, updated=excluded.updated')
            capacityJson.forEach((item) => {
                sql.run([parseDate(item.date).getTime() / 1000, item.booked, Date.now() / 1000])
            });
            sql.finalize();
        })
        db.close();
    });*/
}

module.exports = { parseDate, convertArray, toSimpleDate, saveToDatabase };

