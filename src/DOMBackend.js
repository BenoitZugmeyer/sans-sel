/*eslint-env browser*/

var makeClass = require("./makeClass");
var Backend = require("./Backend");

module.exports = makeClass(Backend, {

    addRule: function (rule) {
        if (!this._sheet) {
            var element = document.createElement("style");
            document.head.appendChild(element);
            this._sheet = element.sheet;
        }
        this._sheet.insertRule(rule, this._sheet.cssRules.length);
    },

});

