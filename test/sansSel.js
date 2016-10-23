import sansSel from "../src/sansSel";
import createTestBackend from "./createTestBackend";

describe("sansSel", function () {

    it("should be a function", function () {
        sansSel.should.be.a.Function();
    });

    it("should throw if invoked with bad options", function () {
        (function () { sansSel({ name: 1 }); }).should.throw("The 'name' option should be a string");
        (function () { sansSel({ backend: 1 }); }).should.throw("The 'backend' option should be a function");
    });

    var ss;
    let backend;
    beforeEach(function () {
        backend = createTestBackend();
        ss = sansSel({backend});
    });

    describe("addRule", function () {

        it("should exist", function () {
            ss.addRule.should.be.a.Function();
        });

        it("should raise if an invalid name is given", function () {
            ss.addRule.bind(ss, "-a").should.throw("Invalid identifier: -a");
        });

        it("should raise if no name is given", function () {
            ss.addRule.bind(ss).should.throw("The 'name' argument should be a string");
        });

        it("should raise if no declaration is given", function () {
            ss.addRule.bind(ss, "foo").should.throw("The 'declaration' argument should be a plain object");
        });

        it("should raise if an already existing name is given", function () {
            ss.addRule("foo", {});
            ss.addRule.bind(ss, "foo", {}).should.throw("A \"foo\" style already exists");
        });

    });

    describe("render", function () {

        it("should render basic style", function () {
            ss.addRule("foo", { color: "red" });
            ss("foo");
            backend.rules.should.eql([
                ".__foo__0{color:red;}",
            ]);
        });

        it("should render media query", function () {
            ss.addRule("foo", {
                "media screen": {
                    color: "red",
                },
            });
            ss("foo");
            backend.rules.should.eql([
                "@media screen{.__foo__0{color:red;}}",
            ]);
        });

        it("should repeat properties with arrays as value", function () {
            ss.addRule("foo", {
                border: ["blue", "red"],
            });
            ss("foo");
            backend.rules.should.eql([
                ".__foo__0{border:red;\nborder:blue;}",
            ]);
        });

        it("should renders rule sets in order", function () {

            ss.addRule("foo", {
                foo: "bar",
                "media screen": {
                    bar: "baz",
                },
            });
            ss("foo");

            backend.rules.should.eql([
                ".__foo__0{foo:bar;}",
                "@media screen{.__foo__0{bar:baz;}}",
            ]);

        });

        it("should render nested pseudo selectors", function () {
            ss.addRule("foo", {
                foo: "bar",
                focus: {
                    foo: "baz",
                    hover: {
                        foo: "biz",
                    },
                },
            });
            ss("foo");
            backend.rules.should.eql([
                ".__foo__0{foo:bar;}",
                ".__foo__0:focus{foo:baz;}",
                ".__foo__0:focus:hover{foo:biz;}",
            ]);
        });

        it("should raise if an invalid property is given", function () {
            ss.addRule("a", { "-foobar": 1 });
            ss.addRule("b", { "foo bar": 1 });
            ss.addRule("c", { "foo:bar": 1 });
            ss.bind(ss, "a").should.throw("Invalid identifier: -foobar");
            ss.bind(ss, "b").should.throw("Invalid identifier: foo bar");
            ss.bind(ss, "c").should.throw("Invalid identifier: foo:bar");
        });

        it("should accept render results as argument", function () {
            ss.addRules({
                foo: { color: "red" },
                bar: { color: "blue" },
            });
            var renderResult = ss("foo");
            ss(renderResult, "bar").toString().should.eql("__foo__0 __bar__1");
        });
    });

    describe("namespace", function () {

        it("should exist", function () {
            ss.namespace.should.be.a.Function();
        });

        it("should return a function", function () {
            ss.namespace("foo").should.be.a.Function();
        });

        it("should prefix all classes by the name", function () {
            var ns = ss.namespace("foo");
            ns.addRule("style", {});
            ns("style").toString().should.equal("foo__style__0");
        });

        it("should concatenate prefixes", function () {
            var ns = ss.namespace("foo").namespace("bar");
            ns.addRule("style", {});
            ns("style").toString().should.equal("foo_bar__style__0");
        });

        it("should support own transforms", function () {
            var ns = ss.namespace("foo");
            ss.addTransform("foo", {
                textDecoration: "underline",
            });
            ns.addTransform("bar", {
                foo: true,
                background: "red",
            });
            ns.addRule("baz", {
                bar: true,
            });
            ns("baz");
            backend.rules.should.eql([
                ".foo__baz__0{text-Decoration:underline;background:red;}",
            ]);
        });

        it("should return the same object if called with the same name", function () {
            ss.namespace("foo").should.be.equal(ss.namespace("foo"));
        });

        it("should support style inheritance", function () {
            ss.addRule("foo", {});
            ss.addRule("bar", {});
            var ns = ss.namespace("ns");
            ns.addRule("bar", {});
            ns.addRule("baz", {
                inherit: ["foo", "bar"],
            });
            ns("baz").toString().should.be.equal("__foo__0 ns__bar__1 ns__baz__2");
        });

    });

    describe("transforms", function () {
        it("should apply transforms", function () {
            ss.addTransform("display", function (v) {
                if (v === "flex") {
                    v = "-webkit-" + v;
                }
                return {
                    display: v,
                };
            });

            ss.addRule("foo", {
                display: "flex",
            });
            ss("foo");

            backend.rules.should.eql([
                ".__foo__0{display:-webkit-flex;}",
            ]);
        });

        it("should support transformable media rules and nested pseudo selectors", function () {
            ss.addTransform("customMedia", function (v) {
                return {
                    "media foo": v,
                };
            });

            ss.addRule("foo", {
                color: "red",
                customMedia: {
                    color: "blue",
                    hover: {
                        color: "yellow",
                    },
                },
            });
            ss("foo");

            backend.rules.should.eql([
                ".__foo__0{color:red;}",
                "@media foo{.__foo__0{color:blue;}}",
                "@media foo{.__foo__0:hover{color:yellow;}}",
            ]);
        });
    });
});
