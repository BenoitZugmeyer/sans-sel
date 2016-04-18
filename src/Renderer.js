import splat from "./splat";
import formatDeclarations from "./formatDeclarations";
import defineProperties from "./defineProperties";

export default class Renderer {

    constructor(backend) {
        this._spec = 0;
        defineProperties(this, {
            _specs: Object.create(null),
            _backend: backend,
        });
    }

    render(selectors) {
        let currentSpec = -1;

        return splat(selectors).map((selector) => {
            let spec = -1;
            const specs = this._specs[selector.id] || (this._specs[selector.id] = []);

            for (let i = 0; i < specs.length; i++) {
                if (specs[i] > currentSpec) {
                    spec = specs[i];
                    break;
                }
            }

            if (spec < 0) {
                formatDeclarations("." + selector.class + "__" + this._spec,
                                    selector.declarations,
                                    this._backend);
                specs.push(this._spec);
                spec = this._spec;
                this._spec += 1;
            }

            currentSpec = spec;

            return selector.class + "__" + spec;
        }).join(" ");
    }

}
