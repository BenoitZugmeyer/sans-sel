var splat = require('../src/splat');

describe('splat', function () {

    it('splat two selectors', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};
        splat(a, b).should.eql([a, b]);
    });

    it('splat arrays selectors', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};
        splat(a, [b]).should.eql([a, b]);
    });

    it('ignore empty values', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};
        splat(null, a, null, [null, b]).should.eql([a, b]);
    });

    it('splat parents', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b', parents: [a]};
        var c = {cls: 'c', parents: [a]};

        splat(b, c).should.eql([b, a, c]);
    });

    it('should support fake arrays', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};

        splat({0: a, 1: b, length: 2}).should.eql([a, b]);
    });

});
