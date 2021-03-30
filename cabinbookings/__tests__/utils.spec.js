const utils = require("../util.js")

describe("ConvertArray function", () => {
    test("Convert date in an array", () => {

        expect(utils.convertArray([{"date":"ma 29.3.2021","booked":"0"},{"date":"ti 30.3.2021","booked":"1"}]))
        .toEqual([{"date":new Date(2021, 2, 29, 16),"booked":false},{"date":new Date(2021, 2, 30, 16),"booked":true}]);
        expect(utils.convertArray([{"date":"ma nodate","booked":"0"},{"date":"ti 30.3.2021","booked":"1"}]))
        .toEqual([{"date":new Date(2021, 2, 30, 16),"booked":true}]);
    })
})
describe("Parsedate function", () => {
    test("parse date from string like su 12.03.2021", () => {
        expect(utils.parseDate("ma 13.03.2020")).toEqual(new Date(2020, 2, 13, 16));
        expect(utils.parseDate("ma 13.3.2020")).toEqual(new Date(2020, 2, 13, 16));
        expect(utils.parseDate("ma 3.3.2020")).toEqual(new Date(2020, 2, 3, 16));
        expect(utils.parseDate("ma 3.03.2020")).toEqual(new Date(2020, 2, 3, 16));
        expect(utils.parseDate("1.1.1990")).toEqual(new Date(1990, 0, 1, 16));
        expect(utils.parseDate(" akjsdhfkjahsdf kj 03.03.2000")).toEqual(new Date(2000, 2, 3, 16));
        expect(utils.parseDate(" akjsdhfkjahsdf kj 03.06.2020 asdlkfj alskdjf")).toEqual(new Date(2020, 5, 3, 16));
        expect(utils.parseDate("1.1.199")).toEqual(null);
        expect(utils.parseDate("pe 29.2.2020")).toEqual(new Date(2020, 1, 29, 16));
        expect(utils.parseDate("pe 31.2.2021")).toEqual(null);
        expect(utils.parseDate("pe 30.2.2021")).toEqual(null);
        expect(utils.parseDate("pe 29.2.2021")).toEqual(null);
        expect(utils.parseDate(null)).toEqual(null);
    });
});