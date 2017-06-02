import isUnitLess from "../isUnitLess"

// Found in https://github.com/facebook/react/blob/648822952fa24cf0e6f2d3b387f6e1fa96ec897e/src/renderers/dom/shared/CSSProperty.js
const list = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
}

describe("isUnitLess", () => {

  it("should return true for unitless values", () => {
    for (const name in list) {
      expect(isUnitLess(name)).toBe(true)
    }
  })

  it("should return false for non-unitless values", () => {
    expect(isUnitLess("width")).toBe(false)
  })

})
