var isPlainObject = require('./isPlainObject');
var defineProperties = require('./defineProperties');
var assertValidIdentifier = require('./assertValidIdentifier');
var makeClass = require('./makeClass');
var owns = require('./owns');
var DOMBackend = require('./DOMBackend');
var applyTransforms = require('./applyTransforms');

function get(sansSel, names) {
    return Array.prototype.map.call(names, function (name) {
        if (!(name in sansSel._styles)) {
            throw new Error('Unknown style "' + name + '"');
        }

        return sansSel._styles[name];
    });
}

module.exports = makeClass({

    constructor: function SansSel(options) {
        if (!options) {
            options = {};
        }
        else if (process.env.NODE_ENV !== 'production' && !isPlainObject(options)) {
            throw new Error('options should be a plain object');
        }

        defineProperties(this, {
            name: options.name || '',
            backend: options.backend || new DOMBackend(),
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
            this._namespaces[name] = new this.constructor({
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

        this._styles[name] = {
            cls: cls,
            parents: get(this, directParents),
            declarations: applyTransforms(this.transforms, declarations, this._transformsCache)
        };
    },

    addAll: function (styles) {
        var name;
        for (name in styles) {
            this.add(name, styles[name]);
        }
    },

    render: function () {
        return this.backend._render.apply(this.backend, get(this, arguments));
    }

});

