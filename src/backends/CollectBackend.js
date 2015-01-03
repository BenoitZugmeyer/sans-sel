var makeClass = require('../makeClass');

module.exports = makeClass({

    constructor: function CollectBackend() {
        this._rules = [];
    },

    add: function (id, rule) {
        this._rules.push({
            id: id,
            rule: rule
        });
    },

    remove: function (id) {
        this._rules = this._rules.filter(function (rule) {
            return rule.id !== id;
        });
    },

});
