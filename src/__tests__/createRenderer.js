import createTestBackend from "./_createTestBackend"
import createRenderer from "../createRenderer"

describe("createRenderer", () => {

  it("should render a single rule", () => {
    const backend = createTestBackend()
    const renderer = createRenderer(backend)
    expect(renderer([{id: 0, class: "a"}]).toString()).toEqual("a__0")
    expect(backend.rules).toEqual([])
  })

  it("should render two rules", () => {
    const backend = createTestBackend()
    const renderer = createRenderer(backend)
    expect(renderer([
            {id: 0, class: "a"},
            {id: 1, class: "b"},
    ]).toString()).toEqual("a__0 b__1")
  })

  it("should render two rules declared anormally", () => {
    const backend = createTestBackend()
    const renderer = createRenderer(backend)
    const a = {id: 0, class: "a"}
    const b = {id: 1, class: "b"}
    expect(renderer([a, b]).toString()).toEqual("a__0 b__1")
    expect(renderer([b, a]).toString()).toEqual("b__1 a__2")
    expect(renderer([a, b]).toString()).toEqual("a__0 b__1")
  })
})
