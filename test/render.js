var render = require('../src/render');
var backend = require('./backendMock');

describe('render', function () {

    it('should render a single selector', function () {
        render(backend, [{cls: 'a'}]).should.eql('a__0 ');
        backend.rules.should.eql([]);
    });

    it('should render two selectors', function () {
        render(backend, [
            {cls: 'a'},
            {cls: 'b'}
        ]).should.eql('a__0 b__1 ');
    });

    it('should render two selectors declared anormally', function () {
        var a = {cls: 'a'};
        var b = {cls: 'b'};
        render(backend, [a, b]).should.eql('a__0 b__1 ');
        render(backend, [b, a]).should.eql('b__1 a__2 ');
        render(backend, [a, b]).should.eql('a__0 b__1 ');
    });
});
