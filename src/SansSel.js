import isPlainObject from "./isPlainObject";
import defineProperties from "./defineProperties";
import owns from "./owns";
import createDOMBackend from "./createDOMBackend";
import applyTransforms from "./applyTransforms";
import Rule from "./Rule";
import assertValidIdentifier from "./assertValidIdentifier";
import Renderer from "./Renderer";

function get(sansSel, names, result) {
    var i, l;
    for (i = 0, l = names.length; i < l; i++) {
        var name = names[i];
        if (name) {
            if (name instanceof Rule) {
                result.push(name);
            }
            else if (typeof name === "string") {
                if (!(name in sansSel._styles)) {
                    throw new Error(`Unknown style "${name}"`);
                }
                result.push(sansSel._styles[name]);
            }
            else if (typeof name.length === "number") {
                get(sansSel, name, result);
            }
            else {
                throw new Error(`Style "${name}" has wrong type`);
            }
        }
    }
    return result;
}

export default class SansSel {

    constructor({ name="", backend=null, _renderer=null, _styles=null, _transforms=null }={}) {
        defineProperties(this, {
            name,
            _renderer: _renderer || new Renderer(backend || createDOMBackend()),
            _transformsCache: Object.create(null),
            _namespaces: Object.create(null),
            _transforms: Object.create(_transforms),
            _styles: Object.create(_styles),
        });
    }

    namespace(name) {
        if (__DEV__) {
            assertValidIdentifier(name);

            if (typeof name !== "string") {
                throw new Error("The \"name\" argument should be a string");
            }
        }

        if (!(name in this._namespaces)) {
            this._namespaces[name] = new this.constructor({
                name: this.name ? `${this.name}_${name}` : name,
                _renderer: this._renderer,
                _transforms: this._transforms,
                _styles: this._styles,
            });
        }

        return this._namespaces[name];
    }

    addTransform(name, definition) {
        if (__DEV__) {
            if (typeof name !== "string") {
                throw new Error("The 'name' argument should be a string");
            }
        }

        this._transforms[name] = definition;
        return this;
    }

    addTransforms(set) {
        for (let name in set) this.addTransform(name, set[name]);
        return this;
    }

    addRule(name, declarations) {

        if (__DEV__) {
            if (typeof name !== "string") {
                throw new Error("The \"name\" argument should be a string");
            }

            assertValidIdentifier(name);

            if (!isPlainObject(declarations)) {
                throw new Error("The \"declaration\" argument should be a plain object");
            }

            if (owns(this._styles, name)) {
                throw new Error(`A "${name}" style already exists`);
            }
        }

        let directParents =
            declarations.inherit ?
                Array.isArray(declarations.inherit) ?
                    declarations.inherit :
                    [declarations.inherit] :
            [];

        this._styles[name] = new Rule({
            class: `${this.name}__${name}`,
            parents: this.getRules(directParents),
            declarations: applyTransforms(this._transforms, declarations, this._transformsCache),
        });

        return this;
    }

    addRules(set) {
        for (let name in set) this.addRule(name, set[name]);
        return this;
    }

    getRules() {
        return get(this, arguments, []);
    }

    render() {
        return this._renderer.render(this.getRules(arguments));
    }

}

