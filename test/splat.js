import splat from "../src/splat";

describe("splat", function () {

    it("splat two rules", function () {
        var a = {id: 0, class: "a"};
        var b = {id: 1, class: "b"};
        splat(a, b).should.eql([a, b]);
    });

    it("splat arrays rules", function () {
        var a = {id: 0, class: "a"};
        var b = {id: 1, class: "b"};
        splat(a, [b]).should.eql([a, b]);
    });

    it("ignore empty values", function () {
        var a = {id: 0, class: "a"};
        var b = {id: 1, class: "b"};
        splat(null, a, null, [null, b]).should.eql([a, b]);
    });

    it("splat parents", function () {
        var a = {id: 0, class: "a"};
        var b = {id: 1, class: "b", parents: [a]};
        var c = {id: 2, class: "c", parents: [a]};

        splat(b, c).should.eql([b, a, c]);
    });

    it("should support fake arrays", function () {
        var a = {id: 0, class: "a"};
        var b = {id: 1, class: "b"};

        splat({0: a, 1: b, length: 2}).should.eql([a, b]);
    });

});
