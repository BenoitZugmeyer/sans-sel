import splat from "./splat";
import formatDeclarations from "./formatDeclarations";

export default function createRenderer(backend) {
    var globalSpec = 0;
    var specs = Object.create(null);

    return function render(rules) {
        let currentSpec = -1;

        let className = splat(rules).map((rule) => {
            let ruleSpec = -1;
            const ruleSpecs = specs[rule.id] || (specs[rule.id] = []);

            for (let i = 0; i < ruleSpecs.length; i++) {
                if (ruleSpecs[i] > currentSpec) {
                    ruleSpec = ruleSpecs[i];
                    break;
                }
            }

            if (ruleSpec < 0) {
                formatDeclarations("." + rule.class + "__" + globalSpec,
                                    rule.declarations,
                                    backend);
                ruleSpecs.push(globalSpec);
                ruleSpec = globalSpec;
                globalSpec += 1;
            }

            currentSpec = ruleSpec;

            return rule.class + "__" + ruleSpec;
        }).join(" ");

        return {
            toString: function () {
                return className;
            },
            _rules: rules,
        };
    };
}

