const utils = require("../util.js")

describe("Parsedate function", () => {
    test("parse date from string like su 12.03.2021", () => {
        expect(utils.parseDate("ma 13.03.2020")).toEqual(new Date(2020, 3, 13));
        expect(utils.parseDate("ma 13.3.2020")).toEqual(new Date(2020, 3, 13));
        expect(utils.parseDate("ma 3.3.2020")).toEqual(new Date(2020, 3, 3));
        expect(utils.parseDate("ma 3.03.2020")).toEqual(new Date(2020, 3, 3));
        expect(utils.parseDate("1.1.1990")).toEqual(new Date(1990, 1, 1));
        expect(utils.parseDate(" akjsdhfkjahsdf kj 03.03.2000")).toEqual(new Date(2000, 3, 3));
        expect(utils.parseDate(" akjsdhfkjahsdf kj 03.06.2020 asdlkfj alskdjf")).toEqual(new Date(2020, 6, 3));
        expect(utils.parseDate("1.1.199")).toEqual(null);
        expect(utils.parseDate("pe 29.2.2020")).toEqual(new Date(2020, 2, 29));
        expect(utils.parseDate("pe 31.2.2021")).toEqual(null);
        expect(utils.parseDate("pe 30.2.2021")).toEqual(null);
        expect(utils.parseDate("pe 29.2.2021")).toEqual(null);
    });
});