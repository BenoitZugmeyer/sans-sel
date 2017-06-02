export default function uncamelcase(s) {
  return s.replace(/([A-Z])/g, "-$1")
}
