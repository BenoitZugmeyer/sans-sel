/*jshint browser: true*/

function DOMBackend() {
    this._element = document.createElement('style');
    document.head.appendChild(this._element);
}

DOMBackend.prototype.add = function (id, rule) {
    var sheet = this._element.sheet;
    var length = sheet.cssRules.length;
    sheet.insertRule(rule, length);
    sheet.cssRules[length].__styleId = id;
};

DOMBackend.prototype.remove = function (id) {
    var sheet = this._element.sheet;
    var i;
    for (i = sheet.cssRules.length - 1; i >= 0; i--) {
        if (sheet.cssRules[i].__styleId === id) {
            sheet.removeRule(i);
        }
    }
};

module.exports = DOMBackend;
