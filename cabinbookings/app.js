const express = require('express')
const app = express()
const port = 3011

app.get('/', (req, res) => {
    res.json('Hello world')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
