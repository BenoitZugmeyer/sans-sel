var makeClass = require('./makeClass');
var defineProperties = require('./defineProperties');

var splat = require('./splat');

var formatDeclarations = require('./formatDeclarations');

module.exports = makeClass({

    constructor: function Backend() {
        this._spec = 0;
        defineProperties(this, {
            _specs: Object.create(null)
        });
    },

    _render: function (selectors) {
        var currentSpec = -1;
        var add = this.addRule.bind(this);

        return splat(selectors).map(function (selector) {
            var spec = -1;

            var specs = this._specs[selector.id] || (this._specs[selector.id] = []);

            var i, l;
            for (i = 0, l = specs.length; i < l; i++) {
                if (specs[i] > currentSpec) {
                    spec = specs[i];
                    break;
                }
            }

            if (spec < 0) {
                formatDeclarations('.' + selector.class + '__' + this._spec,
                                   selector.declarations,
                                   add);
                specs.push(this._spec);
                spec = this._spec;
                this._spec += 1;
            }

            currentSpec = spec;

            return selector.class + '__' + spec;
        }, this).join(' ');
    },

    addRule: function () {
        // To override
    }

});
