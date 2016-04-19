import "should";
import isPlainObject from "../src/isPlainObject";

describe("isPlainObject", () => {

    it("should return false for native objects", () => {
        isPlainObject(new Date()).should.equal(false);
        isPlainObject([]).should.equal(false);
    });

    it("should return true for plain objects", () => {
        isPlainObject(Object.create(null)).should.equal(true);
        isPlainObject({}).should.equal(true);
    });

    it("should return false for non objects", () => {
        isPlainObject(false).should.equal(false);
        isPlainObject(true).should.equal(false);
        isPlainObject(null).should.equal(false);
        isPlainObject(undefined).should.equal(false);
    });

});
