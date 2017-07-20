import merge from "./merge"
import isPlainObject from "./isPlainObject"
import owns from "./owns"

const hash = JSON.stringify

function applyTransforms(transforms, declarations, transformCache, result) {
  let property

  for (property in declarations) {
    const value = declarations[property]

    if (!value && value !== 0) continue

    if (property in transforms) {
      const transform = transforms[property]
      const isFunction = typeof transform === "function"
      const key = `${property}:${hash(isFunction ? value : Boolean(value))}`

      if (!owns(transformCache, key)) {
        transformCache[key] = merge({}, isFunction ? transform(value) : value && transform)

        const transformResult = {}
        applyTransforms(transforms,
                                transformCache[key],
                                transformCache,
                                transformResult)
        transformCache[key] = transformResult
      }

      merge(result, transformCache[key])
    }
    else if (isPlainObject(value)) {
      if (!owns(result, property) || !isPlainObject(result[property])) {
        result[property] = {}
      }
      applyTransforms(transforms, value, transformCache, result[property])
    }
    else {
      result[property] = value
    }
  }

  return result
}

export default function (transforms, declarations, transformCache) {
  const result = {}
  applyTransforms(transforms, declarations, transformCache, result)
  return result
}
