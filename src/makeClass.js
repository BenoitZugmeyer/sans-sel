module.exports = function (parent, definition) {

    if (!definition) {
        definition = parent;
        parent = null;
    }

    var constructor = definition.constructor || (definition.constructor = function () {});
    constructor.prototype = definition;

    if (parent) {
        definition.__proto__ = parent.prototype;
        constructor.__proto__ = parent;
    }

    return constructor;
};
