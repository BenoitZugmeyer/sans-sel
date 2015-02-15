function addSelectors(selectors, list) {
    var i;
    for (i = selectors.length - 1; i >= 0; i--) {
        var selector = selectors[i];
        if (selector) {
            if (typeof selector.length === 'number') {
                addSelectors(selector, list);
            }
            else {
                if (list.indexOf(selector) < 0) {
                    list.unshift(selector);
                    if (selector.parents) {
                        addSelectors(selector.parents, list);
                    }
                }
            }
        }
    }
}

module.exports = function splat() {
    var selectors = [];
    addSelectors(arguments, selectors);
    return selectors;
};
