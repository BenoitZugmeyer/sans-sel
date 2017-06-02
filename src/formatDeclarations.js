import isPlainObject from "./isPlainObject"
import uncamelcase from "./uncamelcase"
import formatDeclaration from "./formatDeclaration"

export default function formatDeclarations(selector, declaration, cb, media) {
  let result = ""

  const subRules = []

  for (const property in declaration) {
    const value = declaration[property]

    if (isPlainObject(value)) {
      subRules.push(property)
    }
    else {
      result += formatDeclaration(property, value)
    }
  }

  if (result) {
    result = `${selector}{${result}}`

    if (media) {
      result = `${media}{${result}}`
    }

    cb(result)
  }

  for (let i = 0; i < subRules.length; i++) {
    const property = subRules[i]
    const value = declaration[property]

    if (property[0] === "@") {
      formatDeclarations(selector, value, cb, property)
    }
    else {
      const pseudoProperty =
                property[0] === "$" ? `::${property.slice(1)}` :
                property[0] !== ":" ? `:${property}` :
                    property
      formatDeclarations(`${selector}${uncamelcase(pseudoProperty)}`, value, cb, media)
    }
  }
}
