/*jshint mocha: true*/
require('should');
process.env.NODE_ENV = 'test';
var deepMerge = require('../src/deepMerge');


describe('merge', function () {

    it('should merge declarations added by add', function () {
        var s = deepMerge({ foo: 'bar' }, { bar: 'baz', foo: 'biz' });
        s.should.eql({ bar: 'baz', foo: 'biz' });
    });

    it('should recursively merge objects in declarations', function () {
        var s = deepMerge({ foo: { biz: 'buz' } }, { foo: { baz: 'biz' } });
        s.should.eql({ foo: { biz: 'buz', baz: 'biz' } });
    });

    it('should not merge arrays in declarations', function () {
        var s = deepMerge({ foo: [ 'buz' ] }, { foo: [ 'baz' ] });
        s.should.eql({ foo: [ 'baz' ] });
    });

});
