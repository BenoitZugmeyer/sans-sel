import formatDeclaration from "../formatDeclaration";

describe("formatDeclaration", () => {

    it("should format a simple declaration", () => {
        expect(formatDeclaration("color", "red")).toBe("color:red;");
    });

    it("should support camelcased declarations", () => {
        expect(formatDeclaration("lineHeight", "1").toLowerCase()).toBe("line-height:1;");

        expect(formatDeclaration("MozBorderBox", "box-sizing").toLowerCase()).toBe("-moz-border-box:box-sizing;");
    });

    it("should repeat array values", () => {
        expect(formatDeclaration("border", ["blue", "red"])).toBe("border:red;\nborder:blue;");
    });

    it("should automatically add the px unit when value needs a unit", () => {
        expect(formatDeclaration("border", 1)).toBe("border:1px;");

        expect(formatDeclaration("borderWidth", [1, 2])).toBe("border-Width:2px;\nborder-Width:1px;");
    });

    it("should not add the px unit when the unit is not needed", () => {
        expect(formatDeclaration("lineHeight", 1).toLowerCase()).toBe("line-height:1;");

        expect(formatDeclaration("zIndex", 1).toLowerCase()).toBe("z-index:1;");

        expect(formatDeclaration("flex", [2, 1]).toLowerCase()).toBe("flex:1;\nflex:2;");
    });

    it("should format the \"content\" property like a string", () => {
        expect(formatDeclaration("content", "foo")).toBe("content:\"foo\";");
        expect(formatDeclaration("content", "foo bar")).toBe("content:\"foo bar\";");
        expect(formatDeclaration("content", "foo \"bar")).toBe("content:\"foo \\\"bar\";");
    });
});
