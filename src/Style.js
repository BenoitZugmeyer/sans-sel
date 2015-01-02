var isPlainObject = require('./isPlainObject');
var deepMerge = require('./deepMerge');
var backends = require('./backends');

var formatDeclarationCache;
var styleId;

function assertValidIdentifier(id) {
    if (!/^[a-z](?:[a-z0-9_-]*[a-z0-9])$/i.test(id)) {
        throw new Error('Invalid identifier: ' + id);
    }
}

function formatDeclaration(property, value) {
    assertValidIdentifier(property);
    if (!(property in formatDeclarationCache)) {
        formatDeclarationCache[property] = property.replace(/([A-Z])/g, '-$1');
    }
    if (Array.isArray(value)) {
        value = value.join(' ');
    }
    return formatDeclarationCache[property] + ':' + value + ';';
}

function formatDeclarations(selector, declaration, cb, media) {
    var result = '';

    var subRules = [];
    var property, value;
    for (property in declaration) {

        value = declaration[property];
        if (isPlainObject(value)) {
            subRules.push(property);
        }
        else {
            result += formatDeclaration(property, value);
        }

    }

    if (result) {

        result = selector + '{' + result + '}';

        if (media) {
            result = media + '{' + result + '}';
        }

        cb(result);

    }

    var i, l;
    for (i = 0, l = subRules.length; i < l; i++) {
        property = subRules[i];
        value = declaration[property];
        if (property.slice(0, 6) === 'media ') {
            formatDeclarations(selector, value, cb, '@' + property);
        }
        else {
            formatDeclarations(selector + ':' + property, value, cb);
        }
    }
}

function Style(name, declarations) {

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
    var id = name + '-' + styleId;

    var directParents =
        declarations.inherit ?
            Array.isArray(declarations.inherit) ?
                declarations.inherit :
                [declarations.inherit] :
            [];

    var this_ = this;
    var idTree = Object.create(null);
    var parents = [];
    function add(parent) {
        if (!idTree[parent._id]) {
            idTree[parent._id] = true;
            parent._children.push(this_);
            parents.push(parent);
        }
    }
    directParents.forEach(function (p) {
        p._parents.forEach(add);
        add(p);
    });

    this._id = id;
    this._parents = parents;
    this._children = [];
    this._ids = parents.map(function (p) { return p._id; });
    this._ids.push(id);
    this._injectedInBackend = false;
    this._declarations = deepMerge({}, declarations);
    delete this._declarations.inherit;
}

Style.prototype = {

    constructor: Style,

    toString: function () {
        this.inject();
        return this._ids.join(' ');
    },

    get injected() {
        return Boolean(this._injectedInBackend);
    },

    inject: function () {
        var backend = backends.current;
        if (this._injectedInBackend) {
            if (this._injectedInBackend === backend) return;
            else throw new Error('A style can\'t be injected in two backends');
        }

        this._parents.forEach(function (p) {
            p.inject();
        });

        var rules = [];
        this.iterRules(function (rule) {
            rules.push(rule);
        });

        backend.add(this._id, rules);
        this._injectedInBackend = backend;
    },

    remove: function () {
        if (!this._injectedInBackend) return;

        this._children.forEach(function (c) {
            c.remove();
        });

        this._injectedInBackend.remove(this._id);
        this._injectedInBackend = false;
    },

    iterRules: function (fn) {
        var selector = '.' + this._id;
        formatDeclarations(selector, this._declarations, fn);
    },

    render: function () {
        var result = '';
        this.iterRules(function (ruleSet) {
            result += ruleSet;
        });
        return result;
    },

    apply: function (element) {
        this.inject();
        element.classList.add.apply(element.classList, this._ids);
    },
};

function reset() {
    formatDeclarationCache = Object.create(null);
    styleId = 0;
}
reset();

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    Style.__test_reset = reset;
}

module.exports = Style;

