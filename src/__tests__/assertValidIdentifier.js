import assertValidIdentifier from "../assertValidIdentifier"

describe("assertValidIdentifier", () => {

  it("should work for simple strings", () => {
    expect(assertValidIdentifier.bind(null, "foo")).not.toThrow()
    expect(assertValidIdentifier.bind(null, "bar-foo")).not.toThrow()
    expect(assertValidIdentifier.bind(null, "foo5")).not.toThrow()
    expect(assertValidIdentifier.bind(null, "Foo")).not.toThrow()
    expect(assertValidIdentifier.bind(null, "f")).not.toThrow()
  })

  it("should fail if the identifier is invalid", () => {
    expect(assertValidIdentifier.bind(null, "-foo")).toThrow()
    expect(assertValidIdentifier.bind(null, "bar-")).toThrow()
    expect(assertValidIdentifier.bind(null, "5foo")).toThrow()
    expect(assertValidIdentifier.bind(null, "éé")).toThrow()
    expect(assertValidIdentifier.bind(null, "")).toThrow()
    expect(assertValidIdentifier.bind(null, "foo:bar")).toThrow()
    expect(assertValidIdentifier.bind(null, "foo bar")).toThrow()
    expect(assertValidIdentifier.bind(null, "foo.bar")).toThrow()
    expect(assertValidIdentifier.bind(null, "foo>bar")).toThrow()
    expect(assertValidIdentifier.bind(null, "1")).toThrow()
  })
})

