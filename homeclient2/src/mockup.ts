import express from "express";
import process from "process";

const app = express();
const port = 4000;

app.use(function (err: Error, _req: express.Request, res: express.Response) {
  res.status(500);
  res.send(err);
});

app.get("/electricity/current", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(`{
    "datetime": "2022-04-02T11:55:58.103Z",
    "powerw": 2500
  }`);
  res.end();
});

app.get("/indoor/dev_upstairs", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(
    '{"battery":100.0,"humidity":27.4,"temperature":22.5,"time":"2022-01-31T19:06:06.604000Z"}'
  );
  res.end();
});

app.get("/weathernow", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
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

app.get("/indoor/Shelly", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(
    '{"battery":92.0,"humidity":80.5,"temperature":-3.5,"time":"2022-01-31T19:36:07.313000Z"}'
  );
  res.end();
});

app.get("/electricity/price", (_req, res) => {
  const prices = [];
  for (let i = -5; i < 43; i++) {
    const now = new Date();
    prices.push({
      DateTime: new Date(now.setHours(now.getHours() + i, 0, 0, 0)),
      Price: Math.random() * (20 - 1) + 1,
    });
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(prices));
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Add logic to handle interruption from the terminal
process.on("SIGINT", () => {
  console.info("Interrupted");
  process.exit(0);
});
