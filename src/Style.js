var isPlainObject = require('./isPlainObject');
var deepMerge = require('./deepMerge');
var backends = require('./backends');
var formatDeclarations = require('./formatDeclarations');
var assertValidIdentifier = require('./assertValidIdentifier');

var styleId = 0;

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    Style.__test_reset = function () {
        styleId = 0;
    };
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

        this.iterRules(backend.add.bind(backend, this._id));

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

module.exports = Style;

