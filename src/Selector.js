var makeClass = require("./makeClass");
var defineProperties = require("./defineProperties");

var globalId = 0;

module.exports = makeClass({
    constructor: function Selector(options) {
        if (process.env.NODE_ENV !== "production") {
            if (!options) {
                throw new Error("Selector constructor should have an object as argument");
            }

            if (!options.class) {
                throw new Error("Selector constructor argument should have a class property");
            }
        }
        defineProperties(this, {
            id: globalId,
            class: options.class,
            parents: options.parents,
            declarations: options.declarations,
        });
        globalId += 1;
    },
});
