var makeClass = require('./makeClass');
var defineProperties = require('./defineProperties');

var splat = require('./splat');

var formatDeclarations = require('./formatDeclarations');

var globalId = 0;

function completeSelector(selector) {
    if (!selector.id) {
        selector.id = globalId;
        globalId += 1;
    }
}


module.exports = makeClass({

    constructor: function Backend() {
        this._spec = 0;
        defineProperties(this, {
            _specs: Object.create(null)
        });
    },

    _render: function (selectors) {
        var currentSpec = -1;
        var result = '';

        for (var selector of splat(selectors)) {
            completeSelector(selector);

            var hasSpec = false;
            var spec;

            var specs = this._specs[selector.id] || (this._specs[selector.id] = []);

            for (spec of specs) {
                if (spec > currentSpec) {
                    hasSpec = true;
                    break;
                }
            }

            if (!hasSpec) {
                formatDeclarations('.' + selector.cls + '__' + this._spec,
                                   selector.declarations,
                                   this.addRule.bind(this));
                specs.push(this._spec);
                spec = this._spec;
                this._spec += 1;
            }

            result += selector.cls + '__' + spec + ' ';

            currentSpec = spec;
        }

        return result;
    },

    addRule: function () {
        // To override
    }
});
