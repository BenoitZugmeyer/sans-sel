var isPlainObject = require('./isPlainObject');
var assertValidIdentifier = require('./assertValidIdentifier');

var formatDeclarationCache = Object.create(null);

var unitLess = Object.create(null);
[
    'columnCount',
    'fillOpacity',
    'flex',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'strokeOpacity',
    'transition',
    'transitionDelay',
    'transitionDuration',
    'widows',
    'zIndex',
    'zoom',
].forEach(function (property) {
    unitLess[property] = true;
});

function addUnit(value) {
    return typeof value === 'number' ? value + 'px' : value;
}

function formatDeclaration(property, value) {
    assertValidIdentifier(property);
    var isUnitLess = unitLess[property];

    if (property === 'content') {
        value = JSON.stringify(value);
    }
    else if (Array.isArray(value)) {
        if (!isUnitLess) {
            value = value.map(addUnit);
        }
        value = value.join(' ');
    }
    else if (!isUnitLess) {
        value = addUnit(value);
    }

    if (!(property in formatDeclarationCache)) {
        formatDeclarationCache[property] = property.replace(/([A-Z])/g, '-$1');
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

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    formatDeclarations.__test_formatDeclaration = formatDeclaration;
}

module.exports = formatDeclarations;
