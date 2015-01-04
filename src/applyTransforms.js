var merge = require('./merge');
var isPlainObject = require('./isPlainObject');

var hash = JSON.stringify;

function applyTransforms(transforms, declarations, transformCache, result) {
    var property;

    for (property in declarations) {
        var value = declarations[property];

        if (property in transforms) {
            var transform = transforms[property];
            var isFunction = typeof transform === 'function';
            var key = property + (isFunction ? ':' + hash(value) : '');

            if (!(key in transformCache)) {
                transformCache[key] = merge(
                    Object.create(null),
                    isFunction ? transform(value) : transform
                );
                applyTransforms(transforms, transformCache[key], transformCache, transformCache[key]);
            }

            if (declarations !== transformCache[key]) {
                merge(result, transformCache[key]);
            }
        }
        else if (isPlainObject(value)) {
            if (!isPlainObject(result[property])) {
                result[property] = Object.create(null);
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
    var result = Object.create(null);
    applyTransforms(transforms, declarations, transformCache, result);
    return result;
};
