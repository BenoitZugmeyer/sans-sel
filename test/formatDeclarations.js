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
        const declaration = {
            color: "red",
            background: "yellow",
        };

        const c = collectRules();
        formatDeclarations(".selector", declaration, c);
        c.rules.should.eql([".selector{color:red;background:yellow;}"]);
    });

    it("should add a media query if needed", () => {
        const declaration = {
            color: "red",
            background: "yellow",
        };

        const c = collectRules();
        formatDeclarations(".selector", declaration, c, "@media foo");
        c.rules.should.eql(["@media foo{.selector{color:red;background:yellow;}}"]);
    });

    it("should ignore empty declarations", () => {
        const declaration = {};
        const c = collectRules();
        formatDeclarations(".selector", declaration, c, "@media foo");
        c.rules.should.eql([]);
    });

    it("should raise more rules for sub rules", () => {
        const declarations = {
            background: "red",
            hover: {
                background: "yellow",
            },
        };

        const c = collectRules();
        formatDeclarations(".selector", declarations, c);
        c.rules.should.eql([
            ".selector{background:red;}",
            ".selector:hover{background:yellow;}",
        ]);
    });

    it("should raise more rules for media", () => {
        const declarations = {
            background: "red",
            "media screen": {
                background: "yellow",
            },
        };

        const c = collectRules();
        formatDeclarations(".selector", declarations, c);
        c.rules.should.eql([
            ".selector{background:red;}",
            "@media screen{.selector{background:yellow;}}",
        ]);
    });

});


