import splat from "../src/splat";

describe("splat", () => {

    it("splat two rules", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        splat(a, b).should.eql([a, b]);
    });

    it("splat arrays rules", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        splat(a, [b]).should.eql([a, b]);
    });

    it("ignore empty values", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        splat(null, a, null, [null, b]).should.eql([a, b]);
    });

    it("splat parents", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b", parents: [a]};
        const c = {id: 2, class: "c", parents: [a]};

        splat(b, c).should.eql([b, a, c]);
    });

    it("should support fake arrays", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};

        splat({0: a, 1: b, length: 2}).should.eql([a, b]);
    });

});
