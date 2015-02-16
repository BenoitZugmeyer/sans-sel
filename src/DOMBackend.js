/*jshint browser: true*/

var makeClass = require('./makeClass');
var Backend = require('./Backend');

module.exports = makeClass(Backend, {

    constructor: function DOMBackend() {
        Backend.call(this);
        var element = document.createElement('style');
        document.head.appendChild(element);
        this._sheet = element.sheet;
    },

    add: function (id, rule) {
        this._sheet.insertRule(rule, this._sheet.cssRules.length);
    },

});

