import makeClass from "./makeClass";
import defineProperties from "./defineProperties";

var globalId = 0;

export default makeClass({
    constructor: function Selector(options) {
        if (__DEV__) {
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
