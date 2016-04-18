import splat from "../src/splat";
import Rule from "../src/Rule";

describe("splat", function () {

    it("splat two selectors", function () {
        var a = new Rule({class: "a"});
        var b = new Rule({class: "b"});
        splat(a, b).should.eql([a, b]);
    });

    it("splat arrays selectors", function () {
        var a = new Rule({class: "a"});
        var b = new Rule({class: "b"});
        splat(a, [b]).should.eql([a, b]);
    });

    it("ignore empty values", function () {
        var a = new Rule({class: "a"});
        var b = new Rule({class: "b"});
        splat(null, a, null, [null, b]).should.eql([a, b]);
    });

    it("splat parents", function () {
        var a = new Rule({class: "a"});
        var b = new Rule({class: "b", parents: [a]});
        var c = new Rule({class: "c", parents: [a]});

        splat(b, c).should.eql([b, a, c]);
    });

    it("should support fake arrays", function () {
        var a = new Rule({class: "a"});
        var b = new Rule({class: "b"});

        splat({0: a, 1: b, length: 2}).should.eql([a, b]);
    });

});
