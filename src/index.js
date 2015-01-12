var isPlainObject = require('./isPlainObject');
var defineProperties = require('./defineProperties');
var assertValidIdentifier = require('./assertValidIdentifier');
var makeClass = require('./makeClass');

var Style = require('./Style');
var backends = require('./backends');
var formatDeclarations = require('./formatDeclarations');
var applyTransforms = require('./applyTransforms');

var SansSel = makeClass({

    constructor: function SansSel(options) {
        if (!options) {
            options = {};
        }
        else if (process.env.NODE_ENV !== 'production' && !isPlainObject(options)) {
            throw new Error('options should be a plain object');
        }

        defineProperties(this, {
            name: options.name || '',
            backend: backends.getBackend(options.backend),
            transforms: options.transforms ? Object.create(options.transforms) : {},
            _transformsCache: Object.create(null),
            _styles: Object.create(null),
        });
    },

    namespace: function (name) {
        return new SansSel({
            name: name,
            backend: this.backend,
            transforms: this.transforms,
        });
    },

    add: function (name, declarations) {

        if (process.env.NODE_ENV !== 'production') {
            if (typeof name !== 'string') {
                throw new Error('The "name" argument should be a string');
            }

            assertValidIdentifier(name);

            if (!isPlainObject(declarations)) {
                throw new Error('The "declaration" argument should be a plain object');
            }

            if (name in this._styles) {
                throw new Error('A "' + name + '" style already exists');
            }
        }

        var cls = this.name + '__' + name;

        var directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                    declarations.inherit :
                    [declarations.inherit] :
            [];

        declarations = applyTransforms(this.transforms, declarations, this._transformsCache);
        formatDeclarations('.' + cls, declarations, this.backend.add.bind(this.backend, cls));

        var style = new Style(this.backend, cls, directParents);
        this._styles[name] = style;
        return style;
    },

});

function sansSel(options) {
    return new SansSel(options);
}

sansSel.merge = require('./merge');
sansSel.SansSel = SansSel;

module.exports = sansSel;
