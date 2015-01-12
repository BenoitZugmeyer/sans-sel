require('should');
var merge = require('../src/merge');

describe('merge', function () {

    it('should merge declarations added by add', function () {
        var s = merge({ foo: 'bar' }, { bar: 'baz', foo: 'biz' });
        s.should.eql({ bar: 'baz', foo: 'biz' });
    });

    it('should recursively merge objects in declarations', function () {
        var s = merge({ foo: { biz: 'buz' } }, { foo: { baz: 'biz' } });
        s.should.eql({ foo: { biz: 'buz', baz: 'biz' } });
    });

    it('should not merge arrays in declarations', function () {
        var s = merge({ foo: [ 'buz' ] }, { foo: [ 'baz' ] });
        s.should.eql({ foo: [ 'baz' ] });
    });

    it('should ignore non plain object as source', function () {
        merge({}, null).should.eql({});
        merge({}, undefined).should.eql({});
        merge({}, new Date()).should.eql({});
    });

    it('should remove null and undefined properties', function () {
        merge({ foo: 4 }, { foo: null }).should.eql({});
        merge({ foo: 4 }, { foo: undefined }).should.eql({});
    });

    it('should replace non-plain objects', function () {
        merge({ foo: new Date() }, { foo: { bar: 'baz' } }).should.eql({ foo: { bar: 'baz' } });
    });

    it('should run a shallow merge if instructed to', function () {
        merge({ foo: { bar: 1 } }, { foo: { baz: 2 } }, true).should.eql({
            foo: { baz: 2 }
        });
    });

});
