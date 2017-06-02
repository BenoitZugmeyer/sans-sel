import isPlainObject from "./isPlainObject"
import owns from "./owns"
import createDOMBackend from "./createDOMBackend"
import applyTransforms from "./applyTransforms"
import assertValidIdentifier from "./assertValidIdentifier"
import createRenderer from "./createRenderer"

let globalId = 0

export default function sansSel({ name="", backend=null, _renderer=null, _styles=null, _transforms=null }={}) {

  if (__DEV__) {
    if (typeof name !== "string") {
      throw new Error("The 'name' option should be a string")
    }

    if (backend !== null && typeof backend !== "function") {
      throw new Error("The 'backend' option should be a function")
    }
  }

  const renderer = _renderer || createRenderer(backend || createDOMBackend())
  const transformsCache = Object.create(null)
  const namespaces = Object.create(null)
  const transforms = Object.create(_transforms)
  const styles = Object.create(_styles)

  function sansSelInstance() {
    return renderer(getRules(arguments))
  }

  sansSelInstance.namespace = namespace
  sansSelInstance.addTransform = addTransform
  sansSelInstance.addTransforms = multiSetter(addTransform)
  sansSelInstance.addRule = addRule
  sansSelInstance.addRules = multiSetter(addRule)

  function multiSetter(fn) {
    return (set) => {
      if (__DEV__) {
        if (!set || typeof set !== "object") {
          throw new Error("The 'set' argument should be an object")
        }
      }

      for (const name in set) fn(name, set[name])

      return sansSelInstance
    }
  }

  function getRulesRec(names, result) {
    let i, l
    for (i = 0, l = names.length; i < l; i++) {
      const name = names[i]
      if (name) {
        const type = typeof name
        if (type === "object" && name) {
          if (name._rules) {
            getRulesRec(name._rules, result)
          }
          else if (name.length) {
            getRulesRec(name, result)
          }
          else {
            result.push(name)
          }
        }
        else if (type === "string") {
          if (!(name in styles)) {
            throw new Error(`Unknown style "${name}"`)
          }
          result.push(styles[name])
        }
        else {
          throw new Error(`Style "${name}" has wrong type`)
        }
      }
    }
    return result
  }

  function getRules() {
    return getRulesRec(arguments, [])
  }

  function namespace(namespaceName) {
    if (__DEV__) {
      assertValidIdentifier(namespaceName)

      if (typeof namespaceName !== "string") {
        throw new Error("The 'name' argument should be a string")
      }
    }

    if (!(namespaceName in namespaces)) {
      namespaces[namespaceName] = sansSel({
        name: name ? `${name}_${namespaceName}` : namespaceName,
        _renderer: renderer,
        _transforms: transforms,
        _styles: styles,
      })
    }

    return namespaces[namespaceName]
  }

  function addTransform(name, definition) {
    if (__DEV__) {
      if (typeof name !== "string") {
        throw new Error("The 'name' argument should be a string")
      }

      if (!definition || (typeof definition !== "object" && typeof definition !== "function")) {
        throw new Error("The 'definition' argument should be an object or a function")
      }

      if (owns(transforms, name)) {
        throw new Error(`The transform ${name} already exists`)
      }
    }

    transforms[name] = definition
    return sansSelInstance
  }

  function addRule(ruleName, declarations) {

    if (__DEV__) {
      if (typeof ruleName !== "string") {
        throw new Error("The 'name' argument should be a string")
      }

      assertValidIdentifier(ruleName)

      if (!isPlainObject(declarations)) {
        throw new Error("The 'declaration' argument should be a plain object")
      }

      if (owns(styles, ruleName)) {
        throw new Error(`A "${ruleName}" style already exists`)
      }
    }

    const directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                    declarations.inherit :
                    [declarations.inherit] :
            []

    styles[ruleName] = {
      id: globalId,
      class: `${name}__${ruleName}`,
      parents: getRules(directParents),
      declarations: applyTransforms(transforms, declarations, transformsCache),
    }
    globalId += 1

    return sansSelInstance
  }

  return sansSelInstance
}
