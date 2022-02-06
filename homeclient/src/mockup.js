import express from "express";
import process from 'process';

const app = express();
const port = 4000;

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

app.get('/indoor/dev_upstairs', (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write('{"battery":100.0,"humidity":27.4,"temperature":22.5,"time":"2022-01-31T19:06:06.604000Z"}');
    res.end();
});

app.get('/weathernow', (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(`[
    {
      "datetime": "2022-01-31T18:40:05Z",
      "temperature": -5.5,
      "humidity": 7.0
    },
    {
      "datetime": "2022-01-31T18:50:05Z",
      "temperature": -5.5,
      "humidity": 7.0
    },
    {
      "datetime": "2022-01-31T19:00:05Z",
      "temperature": -5.6,
      "humidity": 7.0
    },
    {
      "datetime": "2022-01-31T19:10:05Z",
      "temperature": -5.6,
      "humidity": 7.0
    },
    {
      "datetime": "2022-01-31T19:20:05Z",
      "temperature": -5.7,
      "humidity": 7.0
    }
  ]`);
  res.end();
});

app.get('/indoor/Shelly', (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write('{"battery":92.0,"humidity":80.5,"temperature":-3.5,"time":"2022-01-31T19:36:07.313000Z"}');
    res.end();
});
     
app.get('/electricity/price', (req, res) => {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(`
  [
    {
        "DateTime": "2022-02-05T23:00:00.000Z",
        "Price": 3.102
    },
    {
        "DateTime": "2022-02-06T00:00:00.000Z",
        "Price": 3.708
    },
    {
        "DateTime": "2022-02-06T01:00:00.000Z",
        "Price": 2.799
    },
    {
        "DateTime": "2022-02-06T02:00:00.000Z",
        "Price": 2.724
    },
    {
        "DateTime": "2022-02-06T03:00:00.000Z",
        "Price": 2.726
    },
    {
        "DateTime": "2022-02-06T04:00:00.000Z",
        "Price": 3.338
    },
    {
        "DateTime": "2022-02-06T05:00:00.000Z",
        "Price": 2.094
    },
    {
        "DateTime": "2022-02-06T06:00:00.000Z",
        "Price": 2.589
    },
    {
        "DateTime": "2022-02-06T07:00:00.000Z",
        "Price": 1.711
    },
    {
        "DateTime": "2022-02-06T08:00:00.000Z",
        "Price": 1.773
    },
    {
        "DateTime": "2022-02-06T09:00:00.000Z",
        "Price": 1.945
    },
    {
        "DateTime": "2022-02-06T10:00:00.000Z",
        "Price": 2.744
    },
    {
        "DateTime": "2022-02-06T11:00:00.000Z",
        "Price": 3.19
    },
    {
        "DateTime": "2022-02-06T12:00:00.000Z",
        "Price": 3.245
    },
    {
        "DateTime": "2022-02-06T13:00:00.000Z",
        "Price": 3.247
    },
    {
        "DateTime": "2022-02-06T14:00:00.000Z",
        "Price": 4.477
    },
    {
        "DateTime": "2022-02-06T15:00:00.000Z",
        "Price": 9.731
    },
    {
        "DateTime": "2022-02-06T16:00:00.000Z",
        "Price": 9.552
    },
    {
        "DateTime": "2022-02-06T17:00:00.000Z",
        "Price": 15.11
    },
    {
        "DateTime": "2022-02-06T18:00:00.000Z",
        "Price": 10.372
    },
    {
        "DateTime": "2022-02-06T19:00:00.000Z",
        "Price": 11.245
    },
    {
        "DateTime": "2022-02-06T20:00:00.000Z",
        "Price": 11.176
    },
    {
        "DateTime": "2022-02-06T21:00:00.000Z",
        "Price": 9.492
    },
    {
        "DateTime": "2022-02-06T22:00:00.000Z",
        "Price": 4.808
    },
    {
        "DateTime": "2022-02-06T23:00:00.000Z",
        "Price": 2.725
    },
    {
        "DateTime": "2022-02-07T00:00:00.000Z",
        "Price": 2.213
    },
    {
        "DateTime": "2022-02-07T01:00:00.000Z",
        "Price": 2.009
    },
    {
        "DateTime": "2022-02-07T02:00:00.000Z",
        "Price": 1.955
    },
    {
        "DateTime": "2022-02-07T03:00:00.000Z",
        "Price": 3.216
    },
    {
        "DateTime": "2022-02-07T04:00:00.000Z",
        "Price": 9.731
    },
    {
        "DateTime": "2022-02-07T05:00:00.000Z",
        "Price": 15.119
    },
    {
        "DateTime": "2022-02-07T06:00:00.000Z",
        "Price": 16.121
    },
    {
        "DateTime": "2022-02-07T07:00:00.000Z",
        "Price": 16.381
    },
    {
        "DateTime": "2022-02-07T08:00:00.000Z",
        "Price": 16.082
    },
    {
        "DateTime": "2022-02-07T09:00:00.000Z",
        "Price": 19.464
    },
    {
        "DateTime": "2022-02-07T10:00:00.000Z",
        "Price": 19.15
    },
    {
        "DateTime": "2022-02-07T11:00:00.000Z",
        "Price": 19.113
    },
    {
        "DateTime": "2022-02-07T12:00:00.000Z",
        "Price": 16.99
    },
    {
        "DateTime": "2022-02-07T13:00:00.000Z",
        "Price": 15.74
    },
    {
        "DateTime": "2022-02-07T14:00:00.000Z",
        "Price": 15.866
    },
    {
        "DateTime": "2022-02-07T15:00:00.000Z",
        "Price": 16.01
    },
    {
        "DateTime": "2022-02-07T16:00:00.000Z",
        "Price": 16.775
    },
    {
        "DateTime": "2022-02-07T17:00:00.000Z",
        "Price": 16.999
    },
    {
        "DateTime": "2022-02-07T18:00:00.000Z",
        "Price": 16.894
    },
    {
        "DateTime": "2022-02-07T19:00:00.000Z",
        "Price": 16.619
    },
    {
        "DateTime": "2022-02-07T20:00:00.000Z",
        "Price": 15.93
    },
    {
        "DateTime": "2022-02-07T21:00:00.000Z",
        "Price": 15.146
    },
    {
        "DateTime": "2022-02-07T22:00:00.000Z",
        "Price": 12.675
    }
]
`);
res.end();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// Add logic to handle interruption from the terminal
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})
