function addSelectors(selectors, list, added) {
    var i;
    for (i = selectors.length - 1; i >= 0; i--) {
        var selector = selectors[i];
        if (selector) {
            if (typeof selector.length === "number") {
                addSelectors(selector, list, added);
            }
            else if (!added[selector.id]) {
                list.unshift(selector);
                added[selector.id] = true;
                if (selector.parents) {
                    addSelectors(selector.parents, list, added);
                }
            }
        }
    }
}

export default function splat() {
    var selectors = [];
    addSelectors(arguments, selectors, {});
    return selectors;
}
