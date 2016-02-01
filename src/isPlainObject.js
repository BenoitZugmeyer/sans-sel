module.exports = function isPlainObject(o) {
    if (!o || typeof o !== "object") return false;
    var proto = Object.getPrototypeOf(o);
    return !proto || proto === Object.prototype;
};
