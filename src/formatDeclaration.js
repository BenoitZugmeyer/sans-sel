
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

module.exports = function formatDeclaration(property, value) {
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
};
