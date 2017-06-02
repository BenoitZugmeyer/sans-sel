import isPlainObject from "../isPlainObject"

describe("isPlainObject", () => {

  it("should return false for native objects", () => {
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject([])).toBe(false)
  })

  it("should return true for plain objects", () => {
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject({})).toBe(true)
  })

  it("should return false for non objects", () => {
    expect(isPlainObject(false)).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
  })

})
