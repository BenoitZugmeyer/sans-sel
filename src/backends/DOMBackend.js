/*jshint browser: true*/

var makeClass = require('../makeClass');

module.exports = makeClass({

    constructor: function DOMBackend() {
        var element = document.createElement('style');
        this._sheet = element.sheet;
        document.head.appendChild(element);
    },

    add: function (id, rule) {
        var sheet = this._sheet;
        var length = sheet.cssRules.length;
        sheet.insertRule(rule, length);
        sheet.cssRules[length].__styleId = id;
    },

    remove: function (id) {
        var sheet = this._sheet;
        var i;
        for (i = sheet.cssRules.length - 1; i >= 0; i--) {
            if (sheet.cssRules[i].__styleId === id) {
                sheet.removeRule(i);
            }
        }
    },

});
