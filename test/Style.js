/*jshint mocha: true*/
require('should');
process.env.NODE_ENV = 'test';
var Style = require('../src/Style');

beforeEach(function () {
    Style.__test_reset();
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

    describe('populateStyleSheet', function () {

        function StyleSheetMock() {
            this.sheet = {
                insertRule: function (rule, index) {
                    this.cssRules.splice(index, 0, rule);
                },
                cssRules: [],
            };
        }

        it('should populate a stylesheet', function () {
            var s = new Style({
                color: 'red',
                opacity: 1,
                'media screen': {
                    background: 'yellow'
                }
            });
            var element = new StyleSheetMock();
            s.populateStyleSheet(element);
            element.sheet.cssRules.should.eql([
                '.style-1{color:red;opacity:1;}',
                '@media screen{.style-1{background:yellow;}}'
            ]);
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

    });
});
