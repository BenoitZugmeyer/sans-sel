var should = require('should');
var sansSel = require('../src/index');
var backend = require('./backendMock');

describe('index', function () {

    it('should be a function', function () {
        sansSel.should.be.a.Function;
    });

    it('should throw if invoked with something other than an object', function () {
        sansSel.bind(null, []).should.throw('options should be a plain object');
    });

    var ss;
    beforeEach(function () {
        ss = sansSel({backend: backend});
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

    });

    describe('addAll', function () {

        it('should exist', function () {
            ss.addAll.should.be.a.Function;
        });

        it('should add all styles', function () {
            ss.addAll({
                foo: {},
                bar: {},
            });

            should(ss._styles).have.property('foo');
            should(ss._styles).have.property('bar');
        });
    });

    describe('render', function () {

        it('should render basic style', function () {
            ss.add('foo', { color: 'red' });
            ss.render('foo');
            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{color:red;}' },
            ]);
        });

        it('should render media query', function () {
            ss.add('foo', {
                'media screen': {
                    color: 'red'
                }
            });
            ss.render('foo');
            backend.rules.should.eql([
                { id: '__foo', rule: '@media screen{.__foo__0{color:red;}}' },
            ]);
        });

        it('should join arrays with spaces', function () {
            ss.add('foo', {
                border: ['1px', 'solid', 'grey']
            });
            ss.render('foo');
            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{border:1px solid grey;}' }
            ]);
        });

        it('should renders rule sets in order', function () {

            ss.add('foo', {
                foo: 'bar',
                'media screen': {
                    bar: 'baz'
                }
            });
            ss.render('foo');

            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{foo:bar;}' },
                { id: '__foo', rule: '@media screen{.__foo__0{bar:baz;}}' },
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
            ss.render('foo');
            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{foo:bar;}'  },
                { id: '__foo', rule: '.__foo__0:focus{foo:baz;}' },
                { id: '__foo', rule: '.__foo__0:focus:hover{foo:biz;}' },
            ]);
        });

        it('should raise if an invalid property is given', function () {
            ss.add('a', { '-foobar': 1 });
            ss.add('b', { 'foo bar': 1 });
            ss.add('c', { 'foo:bar': 1 });
            ss.render.bind(ss, 'a').should.throw('Invalid identifier: -foobar');
            ss.render.bind(ss, 'b').should.throw('Invalid identifier: foo bar');
            ss.render.bind(ss, 'c').should.throw('Invalid identifier: foo:bar');
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
            var ns = ss.namespace('foo');
            ns.add('style', {});
            ns.render('style').should.equal('foo__style__0 ');
        });

        it('should concatenate prefixes', function () {
            var ns = ss.namespace('foo').namespace('bar');
            ns.add('style', {});
            ns.render('style').should.equal('foo_bar__style__0 ');
        });

        it('should support own transforms', function () {
            var ns = ss.namespace('foo');
            ss.transforms.foo = {
                textDecoration: 'underline',
            };
            ns.transforms.bar = {
                foo: true,
                background: 'red',
            };
            ns.add('baz', {
                bar: true,
            });
            ns.render('baz');
            backend.rules.should.eql([
                { id: 'foo__baz', rule: '.foo__baz__0{text-Decoration:underline;background:red;}' }
            ]);
        });

        it('should return the same object if called with the same name', function () {
            ss.namespace('foo').should.be.equal(ss.namespace('foo'));
        });

        it('should support style inheritance', function () {
            ss.add('foo', {});
            ss.add('bar', {});
            var ns = ss.namespace('ns');
            ns.add('bar', {});
            ns.add('baz', {
                inherit: ['foo', 'bar']
            });
            ns.render('baz').should.be.equal('__foo__0 ns__bar__1 ns__baz__2 ');
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
            ss.render('foo');

            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{display:-webkit-flex;}' }
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
            ss.render('foo');

            backend.rules.should.eql([
                { id: '__foo', rule: '.__foo__0{color:red;}' },
                { id: '__foo', rule: '@media foo{.__foo__0{color:blue;}}' },
                { id: '__foo', rule: '@media foo{.__foo__0:hover{color:yellow;}}' },
            ]);
        });
    });
});
