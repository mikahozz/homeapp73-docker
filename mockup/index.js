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


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// Add logic to handle interruption from the terminal
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})
