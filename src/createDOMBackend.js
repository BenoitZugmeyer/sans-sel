/*eslint-env browser*/

export default function () {
  const element = document.createElement("style")
  document.head.appendChild(element)
  const sheet = element.sheet

  return (rule) => {
    sheet.insertRule(rule, sheet.cssRules.length)
  }
}
