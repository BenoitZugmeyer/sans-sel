var isPlainObject = require('./isPlainObject');
var assertValidIdentifier = require('./assertValidIdentifier');
var Style = require('./Style');
var backends = require('./backends');
var formatDeclarations = require('./formatDeclarations');

var styleId = 0;

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    sansSel.__test_reset = function () {
        styleId = 0;
    };
}

function SansSel(options) {
    if (!options) {
        options = {};
    }
    else if (!isPlainObject(options)) {
        throw new Error('options should be a plain object');
    }

    this._backend = backends.getBackend(options.backend);
}

SansSel.prototype = {

    constructor: SansSel,

    get backend() {
        return this._backend;
    },

    add: function (name, declarations) {
        if (typeof name !== 'string') {
            declarations = name;
            name = 'style';
        }
        else {
            assertValidIdentifier(name);
        }

        if (!isPlainObject(declarations)) {
            throw new Error('Declarations should be a plain object');
        }

        styleId += 1;
        var cls = name + '-' + styleId;

        var directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                declarations.inherit :
                [declarations.inherit] :
            [];

        formatDeclarations('.' + cls, declarations, this._backend.add.bind(this._backend, cls));

        return new Style(this.backend, cls, directParents);
    },

};

function sansSel(options) {
    return new SansSel(options);
}

sansSel.merge = require('./deepMerge');

module.exports = sansSel;
