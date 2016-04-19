import createTestBackend from "./createTestBackend";
import createRenderer from "../src/createRenderer";

describe("createRenderer", () => {

    it("should render a single rule", () => {
        const backend = createTestBackend();
        const renderer = createRenderer(backend);
        renderer([{id: 0, class: "a"}]).toString().should.eql("a__0");
        backend.rules.should.eql([]);
    });

    it("should render two rules", () => {
        const backend = createTestBackend();
        const renderer = createRenderer(backend);
        renderer([
            {id: 0, class: "a"},
            {id: 1, class: "b"},
        ]).toString().should.eql("a__0 b__1");
    });

    it("should render two rules declared anormally", () => {
        const backend = createTestBackend();
        const renderer = createRenderer(backend);
        const a = {id: 0, class: "a"};
        const b = {id: 1, class: "b"};
        renderer([a, b]).toString().should.eql("a__0 b__1");
        renderer([b, a]).toString().should.eql("b__1 a__2");
        renderer([a, b]).toString().should.eql("a__0 b__1");
    });
});
