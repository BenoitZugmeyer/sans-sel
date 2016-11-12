import merge from "../merge";

describe("merge", () => {

    it("should merge declarations added by add", () => {
        const s = merge({ foo: "bar" }, { bar: "baz", foo: "biz" });
        expect(s).toEqual({ bar: "baz", foo: "biz" });
    });

    it("should recursively merge objects in declarations", () => {
        const s = merge({ foo: { biz: "buz" } }, { foo: { baz: "biz" } });
        expect(s).toEqual({ foo: { biz: "buz", baz: "biz" } });
    });

    it("should not merge arrays in declarations", () => {
        const s = merge({ foo: [ "buz" ] }, { foo: [ "baz" ] });
        expect(s).toEqual({ foo: [ "baz" ] });
    });

    it("should ignore non plain object as source", () => {
        expect(merge({}, null)).toEqual({});
        expect(merge({}, undefined)).toEqual({});
        expect(merge({}, new Date())).toEqual({});
    });

    it("should remove null and undefined properties", () => {
        expect(merge({ foo: 4 }, { foo: null })).toEqual({});
        expect(merge({ foo: 4 }, { foo: undefined })).toEqual({});
    });

    it("should replace non-plain objects", () => {
        expect(merge({ foo: new Date() }, { foo: { bar: "baz" } })).toEqual({ foo: { bar: "baz" } });
    });

    it("should run a shallow merge if instructed to", () => {
        expect(merge({ foo: { bar: 1 } }, { foo: { baz: 2 } }, true)).toEqual({
            foo: { baz: 2 },
        });
    });

});
