var backend = require('./testBackend');

describe('render', function () {

    it('should render a single selector', function () {
        backend._render([{cls: 'a'}]).should.eql('a__0 ');
        backend.rules.should.eql([]);
    });

    it('should render two selectors', function () {
        backend._render([
            {cls: 'a'},
            {cls: 'b'}
        ]).should.eql('a__0 b__1 ');
    });

    it('should render two selectors declared anormally', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};
        backend._render([a, b]).should.eql('a__0 b__1 ');
        backend._render([b, a]).should.eql('b__1 a__2 ');
        backend._render([a, b]).should.eql('a__0 b__1 ');
    });
});
