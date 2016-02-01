var merge = require("./merge");
var isPlainObject = require("./isPlainObject");
var owns = require("./owns");

var hash = JSON.stringify;

function applyTransforms(transforms, declarations, transformCache, result) {
    var property;

    for (property in declarations) {
        var value = declarations[property];

        if (property in transforms) {
            var transform = transforms[property];
            var isFunction = typeof transform === "function";
            var key = property + (isFunction ? ":" + hash(value) : "");

            if (!owns(transformCache, key)) {
                transformCache[key] = merge({}, isFunction ? transform(value) : transform);
                var transformResult = {};
                applyTransforms(transforms,
                                transformCache[key],
                                transformCache,
                                transformResult);
                transformCache[key] = transformResult;
            }

            merge(result, transformCache[key]);
        }
        else if (isPlainObject(value)) {
            if (!owns(result, property) || !isPlainObject(result[property])) {
                result[property] = {};
            }
            applyTransforms(transforms, value, transformCache, result[property]);
        }
        else {
            result[property] = value;
        }
    }

    return result;
}

module.exports = function (transforms, declarations, transformCache) {
    var result = {};
    applyTransforms(transforms, declarations, transformCache, result);
    return result;
};
