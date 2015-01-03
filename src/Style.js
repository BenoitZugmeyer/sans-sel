
function Style(backend, cls, parents) {
    this._backend = backend;
    this._parents = parents || [];

    var classes = [cls];

    this._parents.forEach(function (p) {
        p._children.push(this);
        classes.push.apply(classes, p._classes);
    }, this);

    Object.freeze(classes);

    this._classes = classes;
    this._children = [];
    this._active = true;
}

Style.prototype = {

    constructor: Style,

    toString: function () {
        return this._classes.join(' ');
    },

    get active() {
        return this._active;
    },

    get classes() {
        return this._classes;
    },

    remove: function () {
        if (!this._active) return;

        this._children.forEach(function (c) {
            c.remove();
        });

        this._active = false;

        this._parents.forEach(function (p) {
            var i = p._children.indexOf(this);
            if (i >= 0) {
                p._children.splice(i, 1);
            }
        }, this);

        this._backend.remove(this._classes[0]);
    },

};

module.exports = Style;

