import createTestBackend from "./createTestBackend";
import Rule from "../src/Rule";
import Renderer from "../src/Renderer";

describe("Renderer", function () {

    it("should render a single selector", function () {
        const backend = createTestBackend();
        const renderer = new Renderer(backend);
        renderer.render([new Rule({class: "a"})]).should.eql("a__0");
        backend.rules.should.eql([]);
    });

    it("should render two selectors", function () {
        const backend = createTestBackend();
        const renderer = new Renderer(backend);
        renderer.render([
            new Rule({class: "a"}),
            new Rule({class: "b"}),
        ]).should.eql("a__0 b__1");
    });

    it("should render two selectors declared anormally", function () {
        const backend = createTestBackend();
        const renderer = new Renderer(backend);
        const a = new Rule({class: "a"});
        const b = new Rule({class: "b"});
        renderer.render([a, b]).should.eql("a__0 b__1");
        renderer.render([b, a]).should.eql("b__1 a__2");
        renderer.render([a, b]).should.eql("a__0 b__1");
    });
});
