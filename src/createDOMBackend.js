/*eslint-env browser*/

export default function () {
  const element = document.createElement("style")
  document.head.appendChild(element)

  return (rule) => {
    element.appendChild(document.createTextNode(rule))
    // Other way... to investigate which is better
    // element.sheet.insertRule(rule, sheet.cssRules.length)
  }
}
