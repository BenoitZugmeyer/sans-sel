var splat = require('./splat');

var formatDeclarations = require('./formatDeclarations');

var globalId = 0;

function completeSelector(selector) {
    if (!selector.id) {
        selector.id = globalId;
        globalId += 1;
    }
}

module.exports = function render(backend, selectors) {
    var currentSpec = -1;
    var result = '';

    for (var selector of splat([selectors])) {
        completeSelector(selector);

        var hasSpec = false;
        var spec;

        var specs = backend.specs[selector.id] || (backend.specs[selector.id] = []);

        for (spec of specs) {
            if (spec > currentSpec) {
                hasSpec = true;
                break;
            }
        }

        if (!hasSpec) {
            formatDeclarations('.' + selector.cls + '__' + backend.spec,
                               selector.declarations,
                               backend.add.bind(backend, selector.cls));
            specs.push(backend.spec);
            spec = backend.spec;
            backend.spec += 1;
        }

        result += selector.cls + '__' + spec + ' ';

        currentSpec = spec;
    }

    return result;
};
