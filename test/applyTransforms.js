import should from "should";
import applyTransforms from "../src/applyTransforms";

describe("applyTransforms", function () {

    it("exists", function () {
        applyTransforms.should.be.a.Function;
    });

    function apply(transforms, declarations) {
        var result = applyTransforms(transforms, declarations, Object.create(null));
        return should(result);
    }

    it("should replace a simple value", function () {
        apply(
            {
                foo: function (v) {
                    return {
                        bar: v,
                    };
                },
            },
            {
                foo: "flex",
            }
        ).eql({
            bar: "flex",
        });
    });

    it("should memoize transform results", function () {
        apply(
            {
                display: function (v) {
                    if (v === "flex") {
                        v = "-webkit-" + v;
                    }
                    return {
                        display: v,
                    };
                },
            },
            {
                display: "flex",
            }
        ).eql({
            display: "-webkit-flex",
        });
    });

    it("should be able to add more rules", function () {
        apply(
            {
                boxSizing: function (v) {
                    return {
                        boxSizing: v,
                        MozBoxSizing: v,
                    };
                },
            },
            {
                boxSizing: "border-box",
            }
        ).eql({
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
        });
    });

    it("should be able to add more pseudo selectors", function () {
        apply(
            {
                custom: function () {
                    return {
                        textDecoration: "none",
                        hover: {
                            textDecoration: "underline",
                        },
                    };
                },
            },
            {
                custom: true,
                hover: {
                    color: "blue",
                },
            }
        ).eql({
            textDecoration: "none",
            hover: {
                textDecoration: "underline",
                color: "blue",
            },
        });
    });

    it("should be able to add more media queries", function () {
        apply(
            {
                customMediaQuery: function (v) {
                    return {
                        "media foo": v,
                    };
                },
            },
            {
                customMediaQuery: {
                    width: "100px",
                },
            }
        ).eql({
            "media foo": {
                width: "100px",
            },
        });
    });

    it("should be able to make another transform pass", function () {
        apply(
            {
                display: function (v) {
                    if (v === "flex") {
                        v = "-webkit-" + v;
                    }
                    return {
                        display: v,
                    };
                },

                custom: function () {
                    return {
                        display: "flex",
                        textDecoration: "none",
                    };
                },
            },
            {
                custom: true,
            }
        ).eql({
            display: "-webkit-flex",
            textDecoration: "none",
        });
    });

    it("should recurse on sub properties too", function () {
        apply(
            {
                custom: function () {
                    return {
                        textDecoration: "none",
                    };
                },
            },
            {
                hover: {
                    custom: true,
                },
            }
        ).eql({
            hover: {
                textDecoration: "none",
            },
        });
    });

    it("should memoize the results", function () {
        var called = 0;
        apply(
            {
                custom: function () {
                    called++;
                    return {
                        textDecoration: "none",
                    };
                },
            },
            {
                custom: true,
                hover: {
                    custom: true,
                },
            }
        ).eql({
            textDecoration: "none",
            hover: {
                textDecoration: "none",
            },
        });

        called.should.be.equal(1);
    });

    it("should support transforms with plain objects", function () {
        apply(
            {
                custom: {
                    textDecoration: "none",
                },
            },
            {
                custom: true,
            }
        ).eql({
            textDecoration: "none",
        });
    });

    it("should not recurse when a transform returns the same property", function () {
        apply(
            {
                a: {
                    a: "-webkit-flex",
                },
            },
            {
                a: true,
            }
        ).eql({
            a: "-webkit-flex",
        });
    });

    it("should not affect transformed properties to the result", function () {
        apply(
            {
                a: {
                    b: "32",
                },
            },
            {
                a: true,
            }
        ).eql({
            b: "32",
        });
    });

    it("should not affect transformed properties to the result even inside a transform", function () {
        apply(
            {
                b: {
                    c: "-webkit-flex",
                },

                a: {
                    b: "flex",
                },
            },
            {
                a: true,
            }
        ).eql({
            c: "-webkit-flex",
        });
    });

    it("should support transforms from inherited objects", function () {
        var transformsBase = {
            foo: {
                color: "red",
            },
        };
        var transforms = Object.create(transformsBase);
        transforms.bar = {
            foo: true,
            background: "yellow",
        };
        apply(
            transforms,
            {
                bar: true,
            }
        ).eql({
            color: "red",
            background: "yellow",
        });
    });

});
