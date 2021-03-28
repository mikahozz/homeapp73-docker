function parseDate(datestr) {
    let m = datestr.exec(/(\d{1,2}).(\d{1,2}).(\d{4})/);
    return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
}

