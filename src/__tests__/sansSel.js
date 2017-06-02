import sansSel from "../sansSel"
import createTestBackend from "./_createTestBackend"

describe("sansSel", () => {

  it("should be a function", () => {
    expect(typeof sansSel).toBe("function")
  })

  it("should throw if invoked with bad options", () => {
    expect(() => {
      sansSel({ name: 1 })
    }).toThrow("The 'name' option should be a string")
    expect(() => {
      sansSel({ backend: 1 })
    }).toThrow("The 'backend' option should be a function")
  })

  let ss
  let backend
  beforeEach(() => {
    backend = createTestBackend()
    ss = sansSel({backend})
  })

  describe("addRule", () => {

    it("should exist", () => {
      expect(typeof ss.addRule).toBe("function")
    })

    it("should raise if an invalid name is given", () => {
      expect(ss.addRule.bind(ss, "-a")).toThrow("Invalid identifier: -a")
    })

    it("should raise if no name is given", () => {
      expect(ss.addRule.bind(ss)).toThrow("The 'name' argument should be a string")
    })

    it("should raise if no declaration is given", () => {
      expect(ss.addRule.bind(ss, "foo")).toThrow("The 'declaration' argument should be a plain object")
    })

    it("should raise if an already existing name is given", () => {
      ss.addRule("foo", {})
      expect(ss.addRule.bind(ss, "foo", {})).toThrow("A \"foo\" style already exists")
    })

  })

  describe("render", () => {

    it("should render basic style", () => {
      ss.addRule("foo", { color: "red" })
      ss("foo").toString()
      expect(backend.rules).toEqual([
        ".__foo__0{color:red;}",
      ])
    })

    it("should render media query", () => {
      ss.addRule("foo", {
        "@media screen": {
          color: "red",
        },
      })
      ss("foo").toString()
      expect(backend.rules).toEqual([
        "@media screen{.__foo__0{color:red;}}",
      ])
    })

    it("should repeat properties with arrays as value", () => {
      ss.addRule("foo", {
        border: ["blue", "red"],
      })
      ss("foo").toString()
      expect(backend.rules).toEqual([
        ".__foo__0{border:red;\nborder:blue;}",
      ])
    })

    it("should renders rule sets in order", () => {

      ss.addRule("foo", {
        foo: "bar",
        "@media screen": {
          bar: "baz",
        },
      })
      ss("foo").toString()

      expect(backend.rules).toEqual([
        ".__foo__0{foo:bar;}",
        "@media screen{.__foo__0{bar:baz;}}",
      ])

    })

    it("should render nested pseudo selectors", () => {
      ss.addRule("foo", {
        foo: "bar",
        focus: {
          foo: "baz",
          hover: {
            foo: "biz",
          },
        },
      })
      ss("foo").toString()
      expect(backend.rules).toEqual([
        ".__foo__0{foo:bar;}",
        ".__foo__0:focus{foo:baz;}",
        ".__foo__0:focus:hover{foo:biz;}",
      ])
    })

    it("should raise if an invalid property is given", () => {
      ss.addRule("a", { "-foobar": 1 })
      ss.addRule("b", { "foo bar": 1 })
      ss.addRule("c", { "foo:bar": 1 })
      expect(() => ss("a").toString()).toThrow("Invalid identifier: -foobar")
      expect(() => ss("b").toString()).toThrow("Invalid identifier: foo bar")
      expect(() => ss("c").toString()).toThrow("Invalid identifier: foo:bar")
    })

    it("should accept render results as argument", () => {
      ss.addRules({
        foo: { color: "red" },
        bar: { color: "blue" },
      })
      const renderResult = ss("foo")
      expect(ss(renderResult, "bar").toString()).toEqual("__foo__0 __bar__1")
    })
  })

  describe("namespace", () => {

    it("should exist", () => {
      expect(typeof ss.namespace).toBe("function")
    })

    it("should return a function", () => {
      expect(typeof ss.namespace("foo")).toBe("function")
    })

    it("should prefix all classes by the name", () => {
      const ns = ss.namespace("foo")
      ns.addRule("style", {})
      expect(ns("style").toString()).toBe("foo__style__0")
    })

    it("should concatenate prefixes", () => {
      const ns = ss.namespace("foo").namespace("bar")
      ns.addRule("style", {})
      expect(ns("style").toString()).toBe("foo_bar__style__0")
    })

    it("should support own transforms", () => {
      const ns = ss.namespace("foo")
      ss.addTransform("foo", {
        textDecoration: "underline",
      })
      ns.addTransform("bar", {
        foo: true,
        background: "red",
      })
      ns.addRule("baz", {
        bar: true,
      })
      ns("baz").toString()
      expect(backend.rules).toEqual([
        ".foo__baz__0{text-Decoration:underline;background:red;}",
      ])
    })

    it("should return the same object if called with the same name", () => {
      expect(ss.namespace("foo")).toBe(ss.namespace("foo"))
    })

    it("should support style inheritance", () => {
      ss.addRule("foo", {})
      ss.addRule("bar", {})
      const ns = ss.namespace("ns")
      ns.addRule("bar", {})
      ns.addRule("baz", {
        inherit: ["foo", "bar"],
      })
      expect(ns("baz").toString()).toBe("__foo__0 ns__bar__1 ns__baz__2")
    })

  })

  describe("addTransform", () => {
    it("should exist", () => {
      expect(typeof ss.addTransform).toBe("function")
    })

    it("should apply transforms", () => {
      ss.addTransform("display", (v) => {
        if (v === "flex") {
          v = `-webkit-${v}`
        }
        return {
          display: v,
        }
      })

      ss.addRule("foo", {
        display: "flex",
      })
      ss("foo").toString()

      expect(backend.rules).toEqual([
        ".__foo__0{display:-webkit-flex;}",
      ])
    })

    it("should support transformable media rules and nested pseudo selectors", () => {
      ss.addTransform("customMedia", (v) => {
        return {
          "@media foo": v,
        }
      })

      ss.addRule("foo", {
        color: "red",
        customMedia: {
          color: "blue",
          hover: {
            color: "yellow",
          },
        },
      })
      ss("foo").toString()

      expect(backend.rules).toEqual([
        ".__foo__0{color:red;}",
        "@media foo{.__foo__0{color:blue;}}",
        "@media foo{.__foo__0:hover{color:yellow;}}",
      ])
    })
  })

  describe("addTransforms", () => {
    it("should exist", () => {
      expect(typeof ss.addTransforms).toBe("function")
    })

    it("should apply multiple transforms", () => {
      ss.addTransforms({
        blue: { color: "blue" },
        blueBackground () {
          return { backgroundColor: "blue" }
        },
      })
      ss.addRule("foo", {
        blue: true,
        blueBackground: true,
      })
      ss("foo").toString()

      expect(backend.rules).toEqual([
        ".__foo__0{color:blue;background-Color:blue;}",
      ])
    })
  })
})
