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
    return (array) ? array.map(item => ({ d: toSimpleDate(parseDate(item.date), '-'), b: parseInt(item.booked)}))
        .filter(item => item.d != null) : null;
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

module.exports = { parseDate, convertArray, toSimpleDate };

