/*eslint-env browser*/

import makeClass from "./makeClass";
import Backend from "./Backend";

export default makeClass(Backend, {

    addRule: function (rule) {
        if (!this._sheet) {
            var element = document.createElement("style");
            document.head.appendChild(element);
            this._sheet = element.sheet;
        }
        this._sheet.insertRule(rule, this._sheet.cssRules.length);
    },

});

