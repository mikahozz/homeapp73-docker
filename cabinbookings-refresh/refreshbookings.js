const puppeteer = require('puppeteer');
require('dotenv').config();
const utils = require('./util.js')
const fs = require('fs');

const usernameSelector = 'input[name=username]';
const passwordSelector = 'input[type=password]';
const submitSelector = 'button.login-button';
const capacityTabXPath = "//a[contains(text(), 'Kapasiteetit')]";
const capacityRowSelector = 'table.table.table-condensed.table-striped.table-bordered tr';

(async () => {
    console.log('Launching browser');
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-proxy-server']
      });
    console.log('Opening page');
    const page = await browser.newPage();
    console.log('Going to url ' + process.env.URL);
    await page.goto(process.env.URL, {waitUntil: 'load'});
    console.log('Waiting for selector ' + usernameSelector);
    await page.waitForSelector(usernameSelector);
    await page.type(usernameSelector, process.env.USERNAME);
    await page.type(passwordSelector, process.env.PASSWORD);
    await page.click(submitSelector);
    await page.waitForXPath(capacityTabXPath);
    const capacityTab = await page.$x(capacityTabXPath);
    if(!capacityTab) {
        throw `Coud not find the path ${capacityTabXPath}`
    }
    await capacityTab[0].click();
    await page.waitForSelector(capacityRowSelector);
    let capacity = await page.$$eval(capacityRowSelector, rows => {
        let results = [];
        rows.forEach((row) => {
            let date = row.querySelector('td:nth-child(1)');
            let booked = row.querySelector('td:nth-child(3)');
            if(date) {
                results.push({
                    date: date.innerText,
                    booked: booked.innerText
                });
            }
        });
        return results;
    })
    // Save csv file
    capacityCsv = utils.convertArray(capacity);
    console.log(capacityCsv);
    fs.writeFile(`data/bookings_${utils.toSimpleDate(new Date())}.csv`, capacityCsv, (err) => {
        if (err) {
            throw err;
        }
        console.log("Raw bookings data is saved to csv.");
    });
    browser.close();
    // Write to database
    utils.saveToDatabase(capacity);
    console.log("Bookings data is stored in database.");
})();