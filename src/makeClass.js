module.exports = function (def) {
    var ctr = def.constructor || (def.constructor = function () {});
    ctr.prototype = def;
    return ctr;
};
