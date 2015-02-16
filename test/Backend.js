var backend = require('./testBackend');
var Selector = require('../src/Selector');

describe('Backend', function () {

    it('should render a single selector', function () {
        backend._render([new Selector({class: 'a'})]).should.eql('a__0');
        backend.rules.should.eql([]);
    });

    it('should render two selectors', function () {
        backend._render([
            new Selector({class: 'a'}),
            new Selector({class: 'b'})
        ]).should.eql('a__0 b__1');
    });

    it('should render two selectors declared anormally', function () {
        var a = new Selector({class: 'a'});
        var b = new Selector({class: 'b'});
        backend._render([a, b]).should.eql('a__0 b__1');
        backend._render([b, a]).should.eql('b__1 a__2');
        backend._render([a, b]).should.eql('a__0 b__1');
    });
});
