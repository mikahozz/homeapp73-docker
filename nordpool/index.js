const express = require('express');
const app = express();
const port = 3013;

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

app.get('/test', (req, res) => {
    try {
        res.write("sdfsdf");
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// Add logic to handle interruption from the terminal
var process = require('process')
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})
