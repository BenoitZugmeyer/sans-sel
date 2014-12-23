/*jshint mocha: true*/
var should = require('should');
var style = require('../style');

beforeEach(function () {
    style.__test_reset();
});

describe('style', function () {

    describe('Style', function () {

        it('should exists', function () {
            style.should.have.property('Style');
            style.Style.should.be.a.Function;
        });

        describe('id', function () {

            it('should support anonymous styles', function () {
                var s = new style.Style({});
                s._id.should.equal('style-1');
            });

            it('should support named styles', function () {
                var s = new style.Style('foo', {});
                s._id.should.equal('foo-1');
            });

            it('should always be incremented', function () {
                new style.Style('foo', {});
                var s = new style.Style('bar', {});
                s._id.should.equal('bar-2');
            });

            it('should raise if invalid name', function () {
                (function () {
                    new style.Style('-a');
                }).should.throw();
            });

        });

        describe('render', function () {

            it('should render basic style', function () {
                var s = new style.Style({ color: 'red' });
                s.render().should.equal('.style-1{color:red;}');
            });

            it('should render media query', function () {
                var s = new style.Style({
                    'media screen': {
                        color: 'red'
                    }
                });
                s.render().should.equal('@media screen{.style-1{color:red;}}');
            });

            it('should join arrays with spaces', function () {
                var s = new style.Style({
                    border: ['1px', 'solid', 'grey']
                });
                s.render().should.equal('.style-1{border:1px solid grey;}');
            });

            it('should renders rule sets in order', function () {
                var s = new style.Style({
                    foo: 'bar',
                    'media screen': {
                        bar: 'baz'
                    }
                });
                s.render().should.equal('.style-1{foo:bar;}@media screen{.style-1{bar:baz;}}');
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
                var s = new style.Style({
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
                    add: function () {
                        Array.prototype.push.apply(this, arguments);
                    },
                    length: 0
                };
            }

            it('should add the class name', function () {
                var s = new style.Style({});
                var element = new ElementMock();
                s.apply(element);
                element.classList.length.should.equal(1);
                element.classList[0].should.equal('style-1');
            });

            it('should add inheriting class names too', function () {
                var parent = new style.Style('parent', {});
                var child = new style.Style('child', { inherit: [parent] });
                var element = new ElementMock();
                child.apply(element);
                element.classList.length.should.equal(2);
                element.classList[0].should.equal('parent-1');
                element.classList[1].should.equal('child-2');
            });

        });

        describe('toString', function () {

            it('should return a valid className', function () {
                var s = new style.Style({});
                String(s).should.equal('style-1');
            });

            it('should return the inherited classes as well', function () {
                var s = new style.Style({
                    inherit: [ new style.Style('parent', {}), new style.Style('parent2', {}) ]
                });
                String(s).should.equal('parent-1 parent2-2 style-3');
            });

        });
    });

    describe('merge', function () {

        it('should merge declarations added by add', function () {
            var s = style.merge({ foo: 'bar' }, { bar: 'baz', foo: 'biz' });
            s.should.eql({ bar: 'baz', foo: 'biz' });
        });

        it('should recursively merge objects in declarations', function () {
            var s = style.merge({ foo: { biz: 'buz' } }, { foo: { baz: 'biz' } });
            s.should.eql({ foo: { biz: 'buz', baz: 'biz' } });
        });

        it('should not merge arrays in declarations', function () {
            var s = style.merge({ foo: [ 'buz' ] }, { foo: [ 'baz' ] });
            s.should.eql({ foo: [ 'baz' ] });
        });

    });

});
