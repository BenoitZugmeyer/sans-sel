/*eslint-env browser*/

import Backend from "./Backend";

export default class DOMBackend extends Backend {

    addRule(rule) {
        if (!this._sheet) {
            var element = document.createElement("style");
            document.head.appendChild(element);
            this._sheet = element.sheet;
        }
        this._sheet.insertRule(rule, this._sheet.cssRules.length);
    }

}

