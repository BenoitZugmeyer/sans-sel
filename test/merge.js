require('should');
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

    it('should ignore non plain object as source', function () {
        deepMerge({}, null).should.eql({});
        deepMerge({}, undefined).should.eql({});
        deepMerge({}, new Date()).should.eql({});
    });

    it('should remove null and undefined properties', function () {
        deepMerge({ foo: 4 }, { foo: null }).should.eql({});
        deepMerge({ foo: 4 }, { foo: undefined }).should.eql({});
    });

    it('should replace non-plain objects', function () {
        deepMerge({ foo: new Date() }, { foo: { bar: 'baz' } }).should.eql({ foo: { bar: 'baz' } });
    });

});
