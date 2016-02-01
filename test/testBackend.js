var makeClass = require("../src/makeClass");
var Backend = require("../src/Backend");

var BackendMock = makeClass(Backend, {
    constructor: function BackendMock() {
        Backend.call(this);
        this.rules = [];
    },

    addRule: function (rule) {
        this.rules.push(rule);
    },

    reset: function () {
        this.rules.length = 0;
        this._spec = 0;
        var spec;
        for (spec in this._specs) {
            delete this._specs[spec];
        }
    },
});

var instance = new BackendMock();

beforeEach(function () {
    instance.reset();
});

module.exports = instance;
