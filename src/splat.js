function addRules(rules, list, added) {
    var i;
    for (i = rules.length - 1; i >= 0; i--) {
        var rule = rules[i];
        if (rule) {
            if (typeof rule.length === "number") {
                addRules(rule, list, added);
            }
            else if (!added[rule.id]) {
                list.unshift(rule);
                added[rule.id] = true;
                if (rule.parents) {
                    addRules(rule.parents, list, added);
                }
            }
        }
    }
}

export default function splat() {
    var rules = [];
    addRules(arguments, rules, {});
    return rules;
}
