function addRules(selectors, list, added) {
    var i;
    for (i = selectors.length - 1; i >= 0; i--) {
        var selector = selectors[i];
        if (selector) {
            if (typeof selector.length === "number") {
                addRules(selector, list, added);
            }
            else if (!added[selector.id]) {
                list.unshift(selector);
                added[selector.id] = true;
                if (selector.parents) {
                    addRules(selector.parents, list, added);
                }
            }
        }
    }
}

export default function splat() {
    var selectors = [];
    addRules(arguments, selectors, {});
    return selectors;
}
