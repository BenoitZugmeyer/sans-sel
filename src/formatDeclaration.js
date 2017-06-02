import assertValidIdentifier from "./assertValidIdentifier"
import uncamelcase from "./uncamelcase"
import isUnitLess from "./isUnitLess"

const formatDeclarationCache = Object.create(null)

export default function formatDeclaration(property, value) {
  if (process.env.NODE_ENV !== "production") {
    assertValidIdentifier(property)
  }

  if (Array.isArray(value)) {
    return value.map((v) => formatDeclaration(property, v)).reverse().join("\n")
  }

  if (property === "content") {
    value = JSON.stringify(value)
  }
  else if (typeof value === "number" && !isUnitLess(property)) {
    value += "px"
  }

  if (!(property in formatDeclarationCache)) {
    formatDeclarationCache[property] = uncamelcase(property)
  }

  return `${formatDeclarationCache[property]}:${value};`
}
