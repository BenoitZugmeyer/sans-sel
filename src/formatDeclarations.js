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

function formatDeclarations(selector, declaration, options, media, transforms) {
    var result = '';

    var subRules = [];
    var property, value;

    for (property in declaration) {
        value = declaration[property];

        if (transforms !== false && (property in options.transforms)) {
            var transformedValue = options.transforms[property](value);
            var recurse = transformedValue._recurse === true;
            delete transformedValue._recurse;
            formatDeclarations(selector, transformedValue, options, media, recurse);
        }
        else if (isPlainObject(value)) {
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

        options.fn(result);
    }

    var i, l;
    for (i = 0, l = subRules.length; i < l; i++) {
        property = subRules[i];
        value = declaration[property];

        if (property.slice(0, 6) === 'media ') {
            formatDeclarations(selector, value, options, '@' + property);
        }
        else {
            formatDeclarations(selector + ':' + property, value, options);
        }
    }
}

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    formatDeclarations.__test_formatDeclaration = formatDeclaration;
}

module.exports = formatDeclarations;
