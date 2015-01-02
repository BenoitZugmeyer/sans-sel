/*jshint mocha: true*/
require('should');
var isPlainObject = require('../src/isPlainObject');

describe('isPlainObject', function () {

    it('should return false for native objects', function () {
        isPlainObject(new Date()).should.equal(false);
        isPlainObject([]).should.equal(false);
    });

    it('should return true for plain objects', function () {
        isPlainObject(Object.create(null)).should.equal(true);
        isPlainObject({}).should.equal(true);
    });

    it('should return false for non objects', function () {
        isPlainObject(false).should.equal(false);
        isPlainObject(true).should.equal(false);
        isPlainObject(null).should.equal(false);
        isPlainObject(undefined).should.equal(false);
    });

});
