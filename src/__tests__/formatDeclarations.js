import formatDeclarations from "../formatDeclarations"

describe("formatDeclarations", () => {

  function collectRules() {
    function result(rule) {
      result.rules.push(rule)
    }
    result.rules = []
    return result
  }

  it("should iterate over each rule of a declaration", () => {
    const declaration = {
      color: "red",
      background: "yellow",
    }

    const c = collectRules()
    formatDeclarations(".selector", declaration, c)
    expect(c.rules).toEqual([".selector{color:red;background:yellow;}"])
  })

  it("should add a media query if needed", () => {
    const declaration = {
      color: "red",
      background: "yellow",
    }

    const c = collectRules()
    formatDeclarations(".selector", declaration, c, "@media foo")
    expect(c.rules).toEqual(["@media foo{.selector{color:red;background:yellow;}}"])
  })

  it("should ignore empty declarations", () => {
    const declaration = {}
    const c = collectRules()
    formatDeclarations(".selector", declaration, c, "@media foo")
    expect(c.rules).toEqual([])
  })

  it("should raise more rules for sub rules", () => {
    const declarations = {
      background: "red",
      hover: {
        background: "yellow",
      },
    }

    const c = collectRules()
    formatDeclarations(".selector", declarations, c)
    expect(c.rules).toEqual([
      ".selector{background:red;}",
      ".selector:hover{background:yellow;}",
    ])
  })

  it("should camel-case pseudo-classes", () => {
    const declarations = {
      firstChild: {
        background: "yellow",
      },
    }

    const c = collectRules()
    formatDeclarations(".selector", declarations, c)
    expect(c.rules).toEqual([
      ".selector:first-Child{background:yellow;}",
    ])
  })

  it("should replace leading underscores by double colons for pseudo-elements", () => {
    const declarations = {
      background: "red",
      $firstLetter: {
        background: "yellow",
      },
      $WebkitInputPlaceholder: {
        color: "yellow",
      },
    }

    const c = collectRules()
    formatDeclarations(".selector", declarations, c)
    expect(c.rules).toEqual([
      ".selector{background:red;}",
      ".selector::first-Letter{background:yellow;}",
      ".selector::-Webkit-Input-Placeholder{color:yellow;}",
    ])
  })

  it("should raise more rules for media", () => {
    const declarations = {
      background: "red",
      "@media screen": {
        background: "yellow",
      },
    }

    const c = collectRules()
    formatDeclarations(".selector", declarations, c)
    expect(c.rules).toEqual([
      ".selector{background:red;}",
      "@media screen{.selector{background:yellow;}}",
    ])
  })

})


