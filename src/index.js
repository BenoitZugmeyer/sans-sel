var isPlainObject = require('./isPlainObject');
var defineProperties = require('./defineProperties');
var assertValidIdentifier = require('./assertValidIdentifier');
var makeClass = require('./makeClass');
var owns = require('./owns');
var merge = require('./merge');

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
            _namespaces: Object.create(null),
            _styles: Object.create(options._styles || null),
        });
    },

    namespace: function (name) {
        if (process.env.NODE_ENV !== 'production') {
            assertValidIdentifier(name);

            if (typeof name !== 'string') {
                throw new Error('The "name" argument should be a string');
            }
        }

        if (!(name in this._namespaces)) {
            this._namespaces[name] = new SansSel({
                name: this.name ? this.name + '_' + name : name,
                backend: this.backend,
                transforms: this.transforms,
                _styles: this._styles,
            });
        }

        return this._namespaces[name];
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

            if (owns(this._styles, name)) {
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

        var parents = directParents.map(SansSel.prototype.get, this);

        declarations = applyTransforms(this.transforms, declarations, this._transformsCache);
        formatDeclarations('.' + cls, declarations, this.backend.add.bind(this.backend, cls));

        var selector = cls + ' ' + parents.join('');
        this._styles[name] = selector;
        return selector;
    },

    addAll: function (styles) {
        var name;
        for (name in styles) {
            this.add(name, styles[name]);
        }
    },

    get: function (name) {

        if (process.env.NODE_ENV !== 'production') {
            if (!(name in this._styles)) {
                throw new Error('Unknown style "' + name + '"');
            }
        }

        return this._styles[name];
    },

    getAll: function () {
        var styles = this._styles;

        if (process.env.NODE_ENV !== 'production') {
            var result = Object.create(Object.getPrototypeOf(styles));
            merge(result, styles, true);
            Object.freeze(result);
            styles = result;
        }

        return styles;
    },

});

function sansSel(options) {
    return new SansSel(options);
}

sansSel.merge = merge;
sansSel.SansSel = SansSel;

module.exports = sansSel;
