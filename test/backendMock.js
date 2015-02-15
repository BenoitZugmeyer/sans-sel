beforeEach(function () {
    module.exports.rules.length = 0;
    module.exports.spec = 0;
    module.exports.specs = {};
});

module.exports = {
    rules: [],
    specs: {},
    spec: 0,
    add: function (id, rule) {
        this.rules.push({id: id, rule: rule});
    }
};
