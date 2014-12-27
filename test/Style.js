/*jshint mocha: true*/
require('should');
process.env.NODE_ENV = 'test';
var Style = require('../src/Style');
var backends = require('../src/backends');

beforeEach(function () {
    Style.__test_reset();
    backends.setBackend('collect');
});

describe('Style', function () {

    describe('constructor', function () {

        it('should raise if an invalid name is given', function () {
            (function () {
                new Style('-a', {});
            }).should.throw('Invalid identifier: -a');
        });

        it('should raise if no declaration is given', function () {
            (function () {
                new Style();
            }).should.throw('Declarations should be a plain object');
        });

    });

    describe('_id', function () {

        it('should support anonymous styles', function () {
            var s = new Style({});
            s._id.should.equal('style-1');
        });

        it('should support named styles', function () {
            var s = new Style('foo', {});
            s._id.should.equal('foo-1');
        });

        it('should always be incremented', function () {
            new Style('foo', {});
            var s = new Style('bar', {});
            s._id.should.equal('bar-2');
        });

    });

    describe('render', function () {

        it('should render basic style', function () {
            var s = new Style({ color: 'red' });
            s.render().should.equal('.style-1{color:red;}');
        });

        it('should render media query', function () {
            var s = new Style({
                'media screen': {
                    color: 'red'
                }
            });
            s.render().should.equal('@media screen{.style-1{color:red;}}');
        });

        it('should join arrays with spaces', function () {
            var s = new Style({
                border: ['1px', 'solid', 'grey']
            });
            s.render().should.equal('.style-1{border:1px solid grey;}');
        });

        it('should renders rule sets in order', function () {
            var s = new Style({
                foo: 'bar',
                'media screen': {
                    bar: 'baz'
                }
            });
            s.render().should.equal('.style-1{foo:bar;}@media screen{.style-1{bar:baz;}}');
        });

        it('should raise if an invalid property is given', function () {
            (function () {
                new Style({ '-foobar': 1 }).render();
            }).should.throw('Invalid identifier: -foobar');
            (function () {
                new Style({ 'foo bar': 1 }).render();
            }).should.throw('Invalid identifier: foo bar');
            (function () {
                new Style({ 'foo:bar': 1 }).render();
            }).should.throw('Invalid identifier: foo:bar');
        });

    });

    describe('inject', function () {

        it('should inject a stylesheet', function () {
            var s = new Style({
                color: 'red',
                opacity: 1,
                'media screen': {
                    background: 'yellow'
                }
            });

            s.inject();

            backends.current._rules.should.eql([
                {
                    id: 'style-1',
                    rules: [
                        '.style-1{color:red;opacity:1;}',
                        '@media screen{.style-1{background:yellow;}}'
                    ]
                }
            ]);
            s.injected.should.equal(true);
        });

        it('can\'t be injected in different backends', function () {
            var s = new Style({});
            s.inject();
            backends.setBackend('collect');
            s.inject.bind(s).should.throw('A style can\'t be injected in two backends');
            s.injected.should.equal(true);
        });

        it('should ignore injection twice in the same backend', function () {
            var s = new Style({});
            s.inject();
            s.inject.bind(s).should.not.throw();
            backends.current._rules.should.eql([
                {
                    id: 'style-1',
                    rules: []
                }
            ]);
            s.injected.should.equal(true);
        });

        it('should inject parent styles', function () {
            var parent = new Style('parent', {});
            var s = new Style({ inherit: [parent]});
            s.inject();
            backends.current._rules.should.eql([
                {
                    id: 'parent-1',
                    rules: []
                },
                {
                    id: 'style-2',
                    rules: []
                },
            ]);
            s.injected.should.equal(true);
        });

    });

    describe('remove', function () {

        it('should remove a style', function () {
            var s = new Style({});
            s.inject();
            s.remove();
            backends.current._rules.should.eql([]);
            s.injected.should.equal(false);
        });

        it('should remove children styles', function () {
            var parent = new Style('parent', {});
            var s = new Style({ inherit: [parent]});
            s.inject();
            parent.remove();
            backends.current._rules.should.eql([]);
            s.injected.should.equal(false);
            parent.injected.should.equal(false);
        });

    });

    describe('apply', function () {

        function ElementMock() {
            this.classList = {
                add: Array.prototype.push,
                length: 0
            };
        }

        it('should add the class name', function () {
            var s = new Style({});
            var element = new ElementMock();
            s.apply(element);
            element.classList.length.should.equal(1);
            element.classList[0].should.equal('style-1');
        });

        it('should add inheriting class names too', function () {
            var parent = new Style('parent', {});
            var child = new Style('child', { inherit: [parent] });
            var element = new ElementMock();
            child.apply(element);
            element.classList.length.should.equal(2);
            element.classList[0].should.equal('parent-1');
            element.classList[1].should.equal('child-2');
        });

    });

    describe('toString', function () {

        it('should return a valid className', function () {
            var s = new Style({});
            String(s).should.equal('style-1');
        });

        it('should return the inherited classes as well', function () {
            var s = new Style({
                inherit: [ new Style('parent', {}), new Style('parent2', {}) ]
            });
            String(s).should.equal('parent-1 parent2-2 style-3');
        });

        it('should inject automatically', function () {
            var s = new Style({});
            String(s);
            s.injected.should.equal(true);
        });

    });
});
