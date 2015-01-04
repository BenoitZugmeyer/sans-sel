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
        sansSel.__test_reset();
        ss = sansSel();
    });

    describe('add', function () {

        it('should exist', function () {
            ss.add.should.be.a.Function;
        });

        it('should raise if an invalid name is given', function () {
            ss.add.bind(ss, '-a').should.throw('Invalid identifier: -a');
        });

        it('should raise if no declaration is given', function () {
            ss.add.bind(ss).should.throw('Declarations should be a plain object');
        });

    });

    describe('classes', function () {

        it('should support anonymous styles', function () {
            ss.add({}).classes.should.eql([
                'style-1'
            ]);
        });

        it('should support named styles', function () {
            ss.add('foo', {}).classes.should.eql([
                'foo-1'
            ]);
        });

        it('should always be incremented', function () {
            ss.add('foo', {});
            ss.add('bar', {}).classes.should.eql([
                'bar-2'
            ]);
        });

    });

    describe('render', function () {

        it('should render basic style', function () {
            ss.add({ color: 'red' });
            ss.backend._rules.should.eql([
                { id: 'style-1', rule: '.style-1{color:red;}' },
            ]);
        });

        it('should render media query', function () {
            ss.add({
                'media screen': {
                    color: 'red'
                }
            });
            ss.backend._rules.should.eql([
                { id: 'style-1', rule: '@media screen{.style-1{color:red;}}' },
            ]);
        });

        it('should join arrays with spaces', function () {
            ss.add({
                border: ['1px', 'solid', 'grey']
            });
            ss.backend._rules.should.eql([
                { id: 'style-1', rule: '.style-1{border:1px solid grey;}' }
            ]);
        });

        it('should renders rule sets in order', function () {

            ss.add({
                foo: 'bar',
                'media screen': {
                    bar: 'baz'
                }
            });

            ss.backend._rules.should.eql([
                { id: 'style-1', rule: '.style-1{foo:bar;}' },
                { id: 'style-1', rule: '@media screen{.style-1{bar:baz;}}' },
            ]);

        });

        it('should render nested pseudo selectors', function () {
            ss.add({
                foo: 'bar',
                focus: {
                    foo: 'baz',
                    hover: {
                        foo: 'biz',
                    }
                }
            });
            ss.backend._rules.should.eql([
                { id: 'style-1', rule: '.style-1{foo:bar;}'  },
                { id: 'style-1', rule: '.style-1:focus{foo:baz;}' },
                { id: 'style-1', rule: '.style-1:focus:hover{foo:biz;}' },
            ]);
        });

        it('should raise if an invalid property is given', function () {
            ss.add.bind(ss, { '-foobar': 1 }).should.throw('Invalid identifier: -foobar');
            ss.add.bind(ss, { 'foo bar': 1 }).should.throw('Invalid identifier: foo bar');
            ss.add.bind(ss, { 'foo:bar': 1 }).should.throw('Invalid identifier: foo:bar');
        });

    });

    describe('remove', function () {

        it('should remove a style', function () {
            var s = ss.add({});
            s.remove();
            s.active.should.equal(false);
            ss.backend._rules.should.eql([]);
        });

        it('should remove children styles', function () {
            var parent = ss.add('parent', {});
            var s = ss.add({ inherit: parent });
            parent.remove();
            s.active.should.equal(false);
            parent.active.should.equal(false);
            ss.backend._rules.should.eql([]);
        });

        it('should ignore the removal twice', function () {
            var s1 = ss.add({ color: 'red', });
            ss.add({ color: 'blue', });
            s1.remove();
            s1.remove();
            ss.backend._rules.should.eql([
                { id: 'style-2', rule: '.style-2{color:blue;}'}
            ]);
        });

    });

    describe('toString', function () {

        it('should return a valid className', function () {
            var s = ss.add({});
            String(s).should.equal('style-1 ');
        });

        it('should return the inherited classes as well', function () {
            var s = ss.add({
                inherit: [ ss.add('parent', {}), ss.add('parent2', {}) ]
            });
            String(s).should.equal('style-3 parent-1 parent2-2 ');
        });

    });
});
