import applyTransforms from "../applyTransforms"

describe("applyTransforms", () => {

  it("exists", () => {
    expect(typeof applyTransforms).toBe("function")
  })

  function apply(transforms, declarations) {
    const result = applyTransforms(transforms, declarations, Object.create(null))
    return expect(result)
  }

  it("should replace a simple value", () => {
    apply(
      {
        foo(v) {
          return {
            bar: v,
          }
        },
      },
      {
        foo: "flex",
      }
        ).toEqual({
          bar: "flex",
        })
  })

  it("should memoize transform results", () => {
    apply(
      {
        display(v) {
          if (v === "flex") {
            v = `-webkit-${v}`
          }
          return {
            display: v,
          }
        },
      },
      {
        display: "flex",
      }
        ).toEqual({
          display: "-webkit-flex",
        })
  })

  it("should be able to add more rules", () => {
    apply(
      {
        boxSizing: (v) => {
          return {
            boxSizing: v,
            MozBoxSizing: v,
          }
        },
      },
      {
        boxSizing: "border-box",
      }
        ).toEqual({
          boxSizing: "border-box",
          MozBoxSizing: "border-box",
        })
  })

  it("should be able to add more pseudo selectors", () => {
    apply(
      {
        custom() {
          return {
            textDecoration: "none",
            hover: {
              textDecoration: "underline",
            },
          }
        },
      },
      {
        custom: true,
        hover: {
          color: "blue",
        },
      }
        ).toEqual({
          textDecoration: "none",
          hover: {
            textDecoration: "underline",
            color: "blue",
          },
        })
  })

  it("should be able to add more media queries", () => {
    apply(
      {
        customMediaQuery(v) {
          return {
            "media foo": v,
          }
        },
      },
      {
        customMediaQuery: {
          width: "100px",
        },
      }
        ).toEqual({
          "media foo": {
            width: "100px",
          },
        })
  })

  it("should be able to make another transform pass", () => {
    apply(
      {
        display(v) {
          if (v === "flex") {
            v = `-webkit-${v}`
          }
          return {
            display: v,
          }
        },

        custom() {
          return {
            display: "flex",
            textDecoration: "none",
          }
        },
      },
      {
        custom: true,
      }
        ).toEqual({
          display: "-webkit-flex",
          textDecoration: "none",
        })
  })

  it("should recurse on sub properties too", () => {
    apply(
      {
        custom() {
          return {
            textDecoration: "none",
          }
        },
      },
      {
        hover: {
          custom: true,
        },
      }
        ).toEqual({
          hover: {
            textDecoration: "none",
          },
        })
  })

  it("should memoize the results", () => {
    let called = 0
    apply(
      {
        custom() {
          called++
          return {
            textDecoration: "none",
          }
        },
      },
      {
        custom: true,
        hover: {
          custom: true,
        },
      }
        ).toEqual({
          textDecoration: "none",
          hover: {
            textDecoration: "none",
          },
        })

    expect(called).toBe(1)
  })

  it("should support transforms with plain objects", () => {
    apply(
      {
        custom: {
          textDecoration: "none",
        },
      },
      {
        custom: true,
      }
        ).toEqual({
          textDecoration: "none",
        })
  })

  it("should not recurse when a transform object contains the same property", () => {
    apply(
      {
        a: {
          a: "-webkit-flex",
        },
      },
      {
        a: true,
      }
        ).toEqual({
          a: "-webkit-flex",
        })
  })

  it("should not recurse when a transform function returns the same property", () => {
    apply(
      {
        a() {
          return  {
            a: "-webkit-flex",
          }
        },
      },
      {
        a: true,
      }
        ).toEqual({
          a: "-webkit-flex",
        })
  })

  it("should not affect transformed properties to the result", () => {
    apply(
      {
        a: {
          b: "32",
        },
      },
      {
        a: true,
      }
        ).toEqual({
          b: "32",
        })
  })

  it("should not affect transformed properties to the result even inside a transform", () => {
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
        ).toEqual({
          c: "-webkit-flex",
        })
  })

  it("should support transforms from inherited objects", () => {
    const transformsBase = {
      foo: {
        color: "red",
      },
    }
    const transforms = Object.create(transformsBase)
    transforms.bar = {
      foo: true,
      background: "yellow",
    }
    apply(
            transforms,
      {
        bar: true,
      }
        ).toEqual({
          color: "red",
          background: "yellow",
        })
  })

  it("should ignore falsy transform value", () => {
    apply(
      {
        a: { foo: "bar" },
      },
      {
        a: false,
      }
        ).toEqual({
        })
  })

  it("should ignore falsy transform value returned by a function", () => {
    apply(
      {
        a() {
          return false
        },
      },
      {
        a: true,
      }
        ).toEqual({
        })
  })

  it("should omit falsy value on transform with plain object", () => {
    apply(
      {
        plop: { a: false, b: null, c: undefined, d: "", e: NaN, color: "red" },
      },
      {
        plop: true,
      }
        ).toEqual({
          color: "red",
        })
  })

  it("should omit falsy value on transform with a function", () => {
    apply(
      {
        plop(v) {
          return {
            a: false,
            b: null,
            c: undefined,
            d: "",
            e: NaN,
            color: v,
          }
        },
      },
      {
        plop: "blue",
      }
        ).toEqual({
          color: "blue",
        })
  })
})
