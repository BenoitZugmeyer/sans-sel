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
                ss.add('parent', {});
                ss.add('parent2', {});
                var s = ss.add('foo', {
                    inherit: [ 'parent', 'parent2' ]
                });
                String(s).should.equal('__foo __parent __parent2 ');
            });

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

            ss.get('foo').should.equal('__foo ');
            ss.get('bar').should.equal('__bar ');
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
            var ns = ss.namespace('foo');
            var s = ns.add('style', {});
            String(s).should.equal('foo__style ');
        });

        it('should concatenate prefixes', function () {
            var ns = ss.namespace('foo').namespace('bar');
            var s = ns.add('style', {});
            String(s).should.equal('foo_bar__style ');
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
            ss.backend._rules.should.eql([
                { id: 'foo__baz', rule: '.foo__baz{text-Decoration:underline;background:red;}' }
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
            var s = ns.add('baz', {
                inherit: ['foo', 'bar']
            });
            String(s).should.be.equal('ns__baz __foo ns__bar ');
        });

    });

    describe('get', function () {

        it('should exist', function () {
            ss.get.should.be.a.Function;
        });

        it('should throw if called with an unknown name', function () {
            ss.get.bind(ss, 'foo').should.throw('Unknown style "foo"');
        });

        it('should return the class name of a style', function () {
            ss.add('foo', {});
            ss.get('foo').should.equal('__foo ');
        });

        it('should get parent namespace styles', function () {
            ss.add('foo', {});
            ss.namespace('bar').get('foo').should.equal('__foo ');
        });

        it('should be overidable by a namespace', function () {
            ss.add('foo', {});
            var ns = ss.namespace('bar');
            ns.add('foo', {});
            ns.get('foo').should.equal('bar__foo ');
        });

    });

    describe('getAll', function () {

        it('should exist', function () {
            ss.getAll.should.be.a.Function;
        });

        it('should return a frozen object', function () {
            var res = ss.getAll();
            should(res).be.an.Object;
            Object.isFrozen(res).should.be.true;
        });

        it('should contain the current namespace style as own properties', function () {
            ss.add('foo', {});
            ss.add('bar', {});
            var res = ss.getAll();
            should(res).have.ownProperty('foo').equal('__foo ');
            should(res).have.ownProperty('bar').equal('__bar ');
        });

        it('should inherit styles from parent namespaces', function () {
            var ns = ss.namespace('baz');
            ns.add('bar', {});
            var res = ns.getAll();
            ss.add('foo', {});
            should(res).have.property('foo').equal('__foo ');
            should(res).have.ownProperty('bar').equal('baz__bar ');
        });
    });

    // describe('remove', function () {

    //     it('should remove a style', function () {
    //         var s = ss.add('foo', {});
    //         s.remove();
    //         s.active.should.equal(false);
    //         ss.backend._rules.should.eql([]);
    //     });

    //     it('should remove children styles', function () {
    //         var parent = ss.add('parent', {});
    //         var s = ss.add('foo', { inherit: parent });
    //         parent.remove();
    //         s.active.should.equal(false);
    //         parent.active.should.equal(false);
    //         ss.backend._rules.should.eql([]);
    //     });

    //     it('should ignore the removal twice', function () {
    //         var s1 = ss.add('foo', { color: 'red', });
    //         ss.add('bar', { color: 'blue', });
    //         s1.remove();
    //         s1.remove();
    //         ss.backend._rules.should.eql([
    //             { id: '__bar', rule: '.__bar{color:blue;}'}
    //         ]);
    //     });

    // });

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
