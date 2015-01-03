
function CollectBackend() {
    this._rules = [];
}

CollectBackend.prototype.add = function (id, rule) {
    this._rules.push({
        id: id,
        rule: rule
    });
};

CollectBackend.prototype.remove = function (id) {
    this._rules = this._rules.filter(function (rule) {
        return rule.id !== id;
    });
};

module.exports = CollectBackend;
