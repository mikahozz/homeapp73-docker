import datetime as dt

def parseDate(datestr):
    try:
        date = dt.datetime.strptime(datestr, '%Y-%m-%dT%H:%M:%S.%fZ')
    except ValueError:
        date = dt.datetime.strptime(datestr, '%Y-%m-%dT%H:%M:%SZ')
    return date