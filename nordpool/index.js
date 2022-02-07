import express from "express";
import fetch from 'node-fetch';
import process from 'process';

const app = express();
const port = 3013;

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

app.get('/', (req, res) => {
    try {
        let url = "https://www.nordpoolgroup.com/api/marketdata/page/35?currency=,EUR,EUR,EUR&entityName=FI";

        let settings = { method: "Get" };
        
        console.log("Calling nordpool: " + url);
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                const prices = getPriceArray(json.data.Rows, 1).concat(getPriceArray(json.data.Rows));
                const jsonRes = JSON.stringify(prices);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write(jsonRes);
                res.end();
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(err.message);
            })
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

function getPriceArray(dataRows, daysAgo = 0) {
    return dataRows.filter((rows) => (rows.IsExtraRow == false))
        .map((row) => {
            return { 
                DateTime: parseDate(row.Columns[daysAgo].Name, row.StartTime ), 
                Price: parseFloat((parseFloat(row.Columns[daysAgo].Value.replace(',', '.')) / 10 * 1.24 + 0.24).toFixed(3))
            };
        });
}
function parseDate(dateCET, timeLocal) {
    const dateStr = dateCET.split('-').reverse().join('-');
    const timeStr = timeLocal.slice(11,19);
    let date = new Date(dateStr + "T" + timeStr + "Z");
    date.setHours(date.getHours() - 1); // Reduce one our since the time was in CET and we created a UTC date
    return date;
}
