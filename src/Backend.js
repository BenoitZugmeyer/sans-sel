import defineProperties from "./defineProperties";

import splat from "./splat";

import formatDeclarations from "./formatDeclarations";

export default class Backend {

    constructor() {
        this._spec = 0;
        defineProperties(this, {
            _specs: Object.create(null),
        });
    }

    _render(selectors) {
        var currentSpec = -1;
        var add = (rule) => this.addRule(rule);

        return splat(selectors).map((selector) => {
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
                formatDeclarations("." + selector.class + "__" + this._spec,
                                   selector.declarations,
                                   add);
                specs.push(this._spec);
                spec = this._spec;
                this._spec += 1;
            }

            currentSpec = spec;

            return selector.class + "__" + spec;
        }).join(" ");
    }

    addRule() {
        // To override
    }

}
