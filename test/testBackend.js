import Backend from "../src/Backend";

class BackendMock extends Backend {
    constructor() {
        super();
        this.rules = [];
    }

    addRule(rule) {
        this.rules.push(rule);
    }

    reset() {
        this.rules.length = 0;
        this._spec = 0;
        var spec;
        for (spec in this._specs) {
            delete this._specs[spec];
        }
    }
}

var instance = new BackendMock();

beforeEach(function () {
    instance.reset();
});

export default instance;
