var defineProperties = require('./defineProperties');
var makeClass = require('./makeClass');

module.exports = makeClass({

    constructor: function Style(backend, cls, parents) {
        this._backend = backend;

        if (!parents) {
            parents = [];
        }

        var classes = [cls];

        parents.forEach(function (p) {
            p._children.push(this);
            classes.push.apply(classes, p.classes);
        }, this);

        Object.freeze(classes);

        this._active = true;

        defineProperties(this, {
            classes: classes,
            _children: [],
            _parents: parents,
        });
    },

    toString: function () {
        return this.classes.join(' ');
    },

    get active() {
        return this._active;
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

        this._backend.remove(this.classes[0]);
    },

});
