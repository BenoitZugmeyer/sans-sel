var isPlainObject = require('./isPlainObject');
var defineProperties = require('./defineProperties');
var assertValidIdentifier = require('./assertValidIdentifier');
var makeClass = require('./makeClass');

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

var SansSel = makeClass({

    constructor: function SansSel(options) {
        if (!options) {
            options = {};
        }
        else if (process.env.NODE_ENV !== 'production' && !isPlainObject(options)) {
            throw new Error('options should be a plain object');
        }

        defineProperties(this, {
            backend: backends.getBackend(options.backend),
            transforms: Object.create(null),
        });
    },

    add: function (name, declarations) {
        if (typeof name !== 'string') {
            declarations = name;
            name = 'style';
        }

        if (process.env.NODE_ENV !== 'production') {
            assertValidIdentifier(name);

            if (!isPlainObject(declarations)) {
                throw new Error('Declarations should be a plain object');
            }
        }

        styleId += 1;
        var cls = name + '-' + styleId;

        var directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                    declarations.inherit :
                    [declarations.inherit] :
            [];

        formatDeclarations('.' + cls, declarations, {
            fn: this.backend.add.bind(this.backend, cls),
            transforms: this.transforms,
        });

        return new Style(this.backend, cls, directParents);
    },

});

function sansSel(options) {
    return new SansSel(options);
}

sansSel.merge = require('./merge');

module.exports = sansSel;
