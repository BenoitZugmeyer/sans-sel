var merge = require('./merge');
var isPlainObject = require('./isPlainObject');

var hash = JSON.stringify;

function applyTransforms(transforms, declarations, transformCache) {
    var property;

    for (property in declarations) {
        var value = declarations[property];

        if (property in transforms) {
            var transform = transforms[property];
            var isFunction = typeof transform === 'function';
            var key = property + (isFunction ? ':' + hash(value) : '');

            if (!(key in transformCache)) {
                transformCache[key] = isFunction ? transform(value) : merge({}, transform);
                applyTransforms(transforms, transformCache[key], transformCache);
            }

            if (declarations !== transformCache[key]) {
                delete declarations[property];
                merge(declarations, transformCache[key]);
            }
        }
        else if (isPlainObject(value)) {
            applyTransforms(transforms, value, transformCache);
        }
    }
}

module.exports = applyTransforms;
