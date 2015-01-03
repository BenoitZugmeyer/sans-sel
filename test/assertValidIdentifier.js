var assertValidIdentifier = require('../src/assertValidIdentifier');

describe('assertValidIdentifier', function () {

    it('should work for simple strings', function () {
        assertValidIdentifier.bind(null, 'foo').should.not.throw();
        assertValidIdentifier.bind(null, 'bar-foo').should.not.throw();
        assertValidIdentifier.bind(null, 'foo5').should.not.throw();
        assertValidIdentifier.bind(null, 'Foo').should.not.throw();
    });

    it('should fail if the identifier is invalid', function () {
        assertValidIdentifier.bind(null, '-foo').should.throw();
        assertValidIdentifier.bind(null, 'bar-').should.throw();
        assertValidIdentifier.bind(null, '5foo').should.throw();
        assertValidIdentifier.bind(null, 'éé').should.throw();
        assertValidIdentifier.bind(null, '').should.throw();
        assertValidIdentifier.bind(null, 'foo:bar').should.throw();
        assertValidIdentifier.bind(null, 'foo bar').should.throw();
        assertValidIdentifier.bind(null, 'foo.bar').should.throw();
        assertValidIdentifier.bind(null, 'foo>bar').should.throw();
    });
});

