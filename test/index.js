var should = require('should');
var sansSel = require('../src/index');

describe('index', function () {

    it('should be a function', function () {
        sansSel.should.be.a.Function;
    });

    it('should throw if invoked with something other than an object', function () {
        sansSel.bind(null, []).should.throw('options should be a plain object');
    });

    var ss;
    beforeEach(function () {
        ss = sansSel();
    });

    describe('add', function () {

        it('should exist', function () {
            ss.add.should.be.a.Function;
        });

        it('should raise if an invalid name is given', function () {
            ss.add.bind(ss, '-a').should.throw('Invalid identifier: -a');
        });

        it('should raise if no name is given', function () {
            ss.add.bind(ss).should.throw('The "name" argument should be a string');
        });

        it('should raise if no declaration is given', function () {
            ss.add.bind(ss, 'foo').should.throw('The "declaration" argument should be a plain object');
        });

        it('should raise if an already existing name is given', function () {
            ss.add('foo', {});
            ss.add.bind(ss, 'foo', {}).should.throw('A "foo" style already exists');
        });

        describe('toString', function () {

            it('should return a valid className', function () {
                var s = ss.add('foo', {});
                String(s).should.equal('__foo ');
            });

            it('should return the inherited classes as well', function () {
                var s = ss.add('foo', {
                    inherit: [ ss.add('parent', {}), ss.add('parent2', {}) ]
                });
                String(s).should.equal('__foo __parent __parent2 ');
            });

        });

        describe('classes', function () {

            it('should concatenate namespace and style name', function () {
                ss.add('foo', {}).classes.should.eql([
                    '__foo'
                ]);
            });

        });

    });

    describe('render', function () {

        it('should render basic style', function () {
            ss.add('foo', { color: 'red' });
            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{color:red;}' },
            ]);
        });

        it('should render media query', function () {
            ss.add('foo', {
                'media screen': {
                    color: 'red'
                }
            });
            ss.backend._rules.should.eql([
                { id: '__foo', rule: '@media screen{.__foo{color:red;}}' },
            ]);
        });

        it('should join arrays with spaces', function () {
            ss.add('foo', {
                border: ['1px', 'solid', 'grey']
            });
            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{border:1px solid grey;}' }
            ]);
        });

        it('should renders rule sets in order', function () {

            ss.add('foo', {
                foo: 'bar',
                'media screen': {
                    bar: 'baz'
                }
            });

            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{foo:bar;}' },
                { id: '__foo', rule: '@media screen{.__foo{bar:baz;}}' },
            ]);

        });

        it('should render nested pseudo selectors', function () {
            ss.add('foo', {
                foo: 'bar',
                focus: {
                    foo: 'baz',
                    hover: {
                        foo: 'biz',
                    }
                }
            });
            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{foo:bar;}'  },
                { id: '__foo', rule: '.__foo:focus{foo:baz;}' },
                { id: '__foo', rule: '.__foo:focus:hover{foo:biz;}' },
            ]);
        });

        it('should raise if an invalid property is given', function () {
            ss.add.bind(ss, 'foo', { '-foobar': 1 }).should.throw('Invalid identifier: -foobar');
            ss.add.bind(ss, 'foo', { 'foo bar': 1 }).should.throw('Invalid identifier: foo bar');
            ss.add.bind(ss, 'foo', { 'foo:bar': 1 }).should.throw('Invalid identifier: foo:bar');
        });

    });

    describe('namespace', function () {

        it('should exist', function () {
            ss.namespace.should.be.a.Function;
        });

        it('should return a SansSel instance', function () {
            ss.namespace('foo').should.be.an.instanceOf(sansSel.SansSel);
        });

        it('should prefix all classes by the name', function () {
            
        });

    });

    describe('remove', function () {

        it('should remove a style', function () {
            var s = ss.add('foo', {});
            s.remove();
            s.active.should.equal(false);
            ss.backend._rules.should.eql([]);
        });

        it('should remove children styles', function () {
            var parent = ss.add('parent', {});
            var s = ss.add('foo', { inherit: parent });
            parent.remove();
            s.active.should.equal(false);
            parent.active.should.equal(false);
            ss.backend._rules.should.eql([]);
        });

        it('should ignore the removal twice', function () {
            var s1 = ss.add('foo', { color: 'red', });
            ss.add('bar', { color: 'blue', });
            s1.remove();
            s1.remove();
            ss.backend._rules.should.eql([
                { id: '__bar', rule: '.__bar{color:blue;}'}
            ]);
        });

    });

    describe('transforms', function () {
        it('should exist', function () {
            should(ss.transforms).be.an.Object;
        });

        it('should apply transforms', function () {
            ss.transforms.display = function (v) {
                if (v === 'flex') {
                    v = '-webkit-' + v;
                }
                return {
                    display: v,
                };
            };

            ss.add('foo', {
                display: 'flex',
            });

            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{display:-webkit-flex;}' }
            ]);
        });

        it('should support transformable media rules and nested pseudo selectors', function () {
            ss.transforms.customMedia = function (v) {
                return {
                    'media foo': v,
                };
            };

            ss.add('foo', {
                color: 'red',
                customMedia: {
                    color: 'blue',
                    hover: {
                        color: 'yellow'
                    }
                }
            });

            ss.backend._rules.should.eql([
                { id: '__foo', rule: '.__foo{color:red;}' },
                { id: '__foo', rule: '@media foo{.__foo{color:blue;}}' },
                { id: '__foo', rule: '@media foo{.__foo:hover{color:yellow;}}' },
            ]);
        });
    });
});
