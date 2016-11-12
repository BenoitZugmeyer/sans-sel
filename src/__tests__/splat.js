import splat from "../splat";

describe("splat", () => {

    it("splat two rules", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        expect(splat(a, b)).toEqual([a, b]);
    });

    it("splat arrays rules", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        expect(splat(a, [b])).toEqual([a, b]);
    });

    it("ignore empty values", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        expect(splat(null, a, null, [null, b])).toEqual([a, b]);
    });

    it("splat parents", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b", parents: [a]};
        const c = {id: 2, class: "c", parents: [a]};

        expect(splat(b, c)).toEqual([b, a, c]);
    });

    it("should support fake arrays", () => {
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};

        expect(splat({0: a, 1: b, length: 2})).toEqual([a, b]);
    });

});
