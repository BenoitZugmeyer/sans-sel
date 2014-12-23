function assign(target) {
    var i, l, key;
    for (i = 1, l = arguments.length; i < l; i++) {
        if (arguments[i]) {
            for (key in arguments[i]) {
                target[key] = arguments[i][key];
            }
        }
    }
}

function isPlainObject(o) {
    if (!o || typeof o !== 'object') return false;
    var proto = Object.getPrototypeOf(o);
    return !proto || proto === Object.prototype;
}

function deepMerge(target, source) {
    if (!isPlainObject(source)) return;

    Object.keys(source).forEach(function (key) {
        var sourceValue = source[key];
        if (sourceValue === undefined || sourceValue === null) {
            delete target[key];
        }
        else if (isPlainObject(sourceValue)) {
            if (!Object.prototype.hasOwnProperty.call(target, key) ||
                    !isPlainObject(target[key])) {
                target[key] = {};
            }
            deepMerge(target[key], sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });

    return target;
}

var _formatDeclarationCache;
var _styleId;


function reset() {
    _formatDeclarationCache = Object.create(null);
    _styleId = 0;
}
reset();


function validIdentifier(id) {
    return /^[a-z](?:[a-z0-9_-]*[a-z0-9])$/.test(id);
}

function formatDeclaration(property, value) {
    if (!(property in _formatDeclarationCache)) {
        _formatDeclarationCache[property] = property.replace(/([A-Z])/g, '-$1');
    }
    if (Array.isArray(value)) {
        value = value.join(' ');
    }
    return _formatDeclarationCache[property] + ':' + value + ';';
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
    else if (!validIdentifier(name)) {
        throw new Error('Invalid identifier');
    }

    if (!isPlainObject(declarations)) {
        throw new Error('Declarations should be a plain object');
    }

    _styleId += 1;
    var id = name + '-' + _styleId;

    var parents =
        declarations.inherit ?
            Array.isArray(declarations.inherit) ?
                declarations.inherit :
                [declarations.inherit] :
            [];

    var idTree = {};
    function addId(id) {
        idTree[id] = true;
    }
    parents.forEach(function (p) {
        p._idTree.forEach(addId);
    });
    idTree[id] = true;

    this._id = id;
    this._idTree = Object.keys(idTree);
    this._declarations = deepMerge({}, declarations);
}

Style.prototype = {

    toString: function () {
        return this._idTree.join(' ');
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

    populateStyleSheet: function (element) {
        var sheet = element.sheet;
        this.iterRules(function (ruleSet) {
            sheet.insertRule(ruleSet, sheet.cssRules.length);
        });
    },

    apply: function (element) {
        element.classList.add.apply(element.classList, this._idTree);
    },
};

exports.Style = Style;
exports.merge = deepMerge;

exports.__test_reset = reset;
