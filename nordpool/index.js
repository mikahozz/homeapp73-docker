import express from "express";
import fetch from 'node-fetch';
import process from 'process';

const app = express();
const port = 3013;

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

app.get('/test', (req, res) => {
    try {
        let url = "https://www.nordpoolgroup.com/api/marketdata/page/35?currency=,EUR,EUR,EUR&entityName=FI";

        let settings = { method: "Get" };
        
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                let jsonRes = JSON.stringify(json);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write(jsonRes);
                res.end();
            });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// Add logic to handle interruption from the terminal
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})
