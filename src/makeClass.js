var owns = require('./owns');

module.exports = function (parent, definition) {

    if (!definition) {
        definition = parent;
        parent = null;
    }

    if (!owns(definition, 'constructor')) {
        definition.constructor = function () {
            if (parent) {
                parent.apply(this, arguments);
            }
        };
    }

    var constructor = definition.constructor;
    constructor.prototype = definition;

    if (parent) {
        definition.__proto__ = parent.prototype;
        constructor.__proto__ = parent;
    }

    return constructor;
};
