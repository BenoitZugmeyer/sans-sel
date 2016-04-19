import formatDeclarations from "../src/formatDeclarations";

describe("formatDeclarations", () => {

    function collectRules() {
        function result(rule) {
            result.rules.push(rule);
        }
        result.rules = [];
        return result;
    }

    it("should iterate over each rule of a declaration", () => {
        var declaration = {
            color: "red",
            background: "yellow",
        };

        var c = collectRules();
        formatDeclarations(".selector", declaration, c);
        c.rules.should.eql([".selector{color:red;background:yellow;}"]);
    });

    it("should add a media query if needed", () => {
        var declaration = {
            color: "red",
            background: "yellow",
        };

        var c = collectRules();
        formatDeclarations(".selector", declaration, c, "@media foo");
        c.rules.should.eql(["@media foo{.selector{color:red;background:yellow;}}"]);
    });

    it("should ignore empty declarations", () => {
        var declaration = {};
        var c = collectRules();
        formatDeclarations(".selector", declaration, c, "@media foo");
        c.rules.should.eql([]);
    });

    it("should raise more rules for sub rules", () => {
        var declarations = {
            background: "red",
            hover: {
                background: "yellow",
            },
        };

        var c = collectRules();
        formatDeclarations(".selector", declarations, c);
        c.rules.should.eql([
            ".selector{background:red;}",
            ".selector:hover{background:yellow;}",
        ]);
    });

    it("should raise more rules for media", () => {
        var declarations = {
            background: "red",
            "media screen": {
                background: "yellow",
            },
        };

        var c = collectRules();
        formatDeclarations(".selector", declarations, c);
        c.rules.should.eql([
            ".selector{background:red;}",
            "@media screen{.selector{background:yellow;}}",
        ]);
    });

});


