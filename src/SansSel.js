var isPlainObject = require('./isPlainObject');
var defineProperties = require('./defineProperties');
var makeClass = require('./makeClass');
var owns = require('./owns');
var DOMBackend = require('./DOMBackend');
var applyTransforms = require('./applyTransforms');
var Selector = require('./Selector');

function get(sansSel, names, result) {
    var i, l;
    for (i = 0, l = names.length; i < l; i++) {
        var name = names[i];
        if (name) {
            if (name instanceof Selector) {
                result.push(name);
            }
            else if (typeof name === 'string') {
                if (!(name in sansSel._styles)) {
                    throw new Error('Unknown style "' + name + '"');
                }
                result.push(sansSel._styles[name]);
            }
            else if (typeof name.length === 'number') {
                get(sansSel, name, result);
            }
            else {
                throw new Error('Style "' + name + '" has wrong type');
            }
        }
    }
    return result;
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
            require('./assertValidIdentifier')(name);

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

            require('./assertValidIdentifier')(name);

            if (!isPlainObject(declarations)) {
                throw new Error('The "declaration" argument should be a plain object');
            }

            if (owns(this._styles, name)) {
                throw new Error('A "' + name + '" style already exists');
            }
        }

        var directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                    declarations.inherit :
                    [declarations.inherit] :
            [];

        this._styles[name] = new Selector({
            class: this.name + '__' + name,
            parents: this.get(directParents),
            declarations: applyTransforms(this.transforms, declarations, this._transformsCache)
        });
    },

    addAll: function (styles) {
        var name;
        for (name in styles) {
            this.add(name, styles[name]);
        }
    },

    get: function () {
        return get(this, arguments, []);
    },

    render: function () {
        return this.backend._render.call(this.backend, this.get(arguments));
    }

});

