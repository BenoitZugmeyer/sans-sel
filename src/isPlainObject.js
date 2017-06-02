export default function isPlainObject(o) {
  if (!o || typeof o !== "object") return false
  const proto = Object.getPrototypeOf(o)
  return !proto || proto === Object.prototype
}
