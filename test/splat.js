var splat = require('../src/splat');
var Selector = require('../src/Selector');

describe('splat', function () {

    it('splat two selectors', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b'});
        splat(a, b).should.eql([a, b]);
    });

    it('splat arrays selectors', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b'});
        splat(a, [b]).should.eql([a, b]);
    });

    it('ignore empty values', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b'});
        splat(null, a, null, [null, b]).should.eql([a, b]);
    });

    it('splat parents', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b', parents: [a]});
        var c = new Selector({class: 'c', parents: [a]});

        splat(b, c).should.eql([b, a, c]);
    });

    it('should support fake arrays', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b'});

        splat({0: a, 1: b, length: 2}).should.eql([a, b]);
    });

});
