require('should');
var applyTransforms = require('../src/applyTransforms');

describe('applyTransforms', function () {

    it('exists', function () {
        applyTransforms.should.be.a.Function;
    });

    function apply(transforms, declarations) {
        applyTransforms(transforms, declarations, Object.create(null));
        return declarations;
    }

    it('should replace a simple value', function () {
        apply(
            {
                foo: function (v) {
                    return {
                        bar: v,
                    };
                },
            },
            {
                foo: 'flex',
            }
        ).should.eql({
            bar: 'flex'
        });
    });

    it('should memoize transform results', function () {
        apply(
            {
                display: function (v) {
                    if (v === 'flex') {
                        v = '-webkit-' + v;
                    }
                    return {
                        display: v,
                    };
                },
            },
            {
                display: 'flex',
            }
        ).should.eql({
            display: '-webkit-flex'
        });
    });

    it('should be able to add more rules', function () {
        apply(
            {
                boxSizing: function (v) {
                    return {
                        boxSizing: v,
                        MozBoxSizing: v,
                    };
                },
            },
            {
                boxSizing: 'border-box',
            }
        ).should.eql({
            boxSizing: 'border-box',
            MozBoxSizing: 'border-box',
        });
    });

    it('should be able to add more pseudo selectors', function () {
        apply(
            {
                custom: function () {
                    return {
                        textDecoration: 'none',
                        hover: {
                            textDecoration: 'underline',
                        }
                    };
                },
            },
            {
                custom: true,
                hover: {
                    color: 'blue',
                }
            }
        ).should.eql({
            textDecoration: 'none',
            hover: {
                textDecoration: 'underline',
                color: 'blue',
            }
        });
    });

    it('should be able to add more media queries', function () {
        apply(
            {
                customMediaQuery: function (v) {
                    return {
                        'media foo': v
                    };
                },
            },
            {
                customMediaQuery: {
                    width: '100px'
                }
            }
        ).should.eql({
            'media foo': {
                width: '100px'
            }
        });
    });

    it('should be able to make another transform pass', function () {
        apply(
            {
                display: function (v) {
                    if (v === 'flex') {
                        v = '-webkit-' + v;
                    }
                    return {
                        display: v,
                    };
                },

                custom: function () {
                    return {
                        display: 'flex',
                        textDecoration: 'none',
                    };
                },
            },
            {
                custom: true
            }
        ).should.eql({
            display: '-webkit-flex',
            textDecoration: 'none',
        });
    });

    it('should recurse on sub properties too', function () {
        apply(
            {
                custom: function () {
                    return {
                        textDecoration: 'none',
                    };
                },
            },
            {
                hover: {
                    custom: true,
                }
            }
        ).should.eql({
            hover: {
                textDecoration: 'none',
            }
        });
    });

    it('should memoize the results', function () {
        var called = 0;
        apply(
            {
                custom: function () {
                    called++;
                    return {
                        textDecoration: 'none',
                    };
                },
            },
            {
                custom: true,
                hover: {
                    custom: true,
                }
            }
        ).should.eql({
            textDecoration: 'none',
            hover: {
                textDecoration: 'none',
            }
        });

        called.should.be.equal(1);
    });

});
