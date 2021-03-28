function parseDate(datestr) {
    let re = new RegExp(/(\d{1,2}).(\d{1,2}).(\d{4})/);
    let m = re.exec(datestr);
    return (m) ? new Date(m[3], m[2], m[1]) : null;
}

module.exports = { parseDate };

