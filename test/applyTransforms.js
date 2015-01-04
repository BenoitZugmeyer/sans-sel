var should = require('should');
var applyTransforms = require('../src/applyTransforms');

describe('applyTransforms', function () {

    it('exists', function () {
        applyTransforms.should.be.a.Function;
    });

    function apply(transforms, declarations) {
        applyTransforms(transforms, declarations, Object.create(null));
        //console.log('RESULT', result);
        return should(declarations);
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
        ).eql({
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
        ).eql({
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
        ).eql({
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
        ).eql({
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
        ).eql({
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
        ).eql({
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
        ).eql({
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
        ).eql({
            textDecoration: 'none',
            hover: {
                textDecoration: 'none',
            }
        });

        called.should.be.equal(1);
    });

    it('should support transforms with plain objects', function () {
        apply(
            {
                display: {
                    display: '-webkit-flex',
                },

                custom: {
                    textDecoration: 'none',
                    display: 'flex',
                }
            },
            {
                custom: true,
            }
        ).eql({
            display: '-webkit-flex',
            textDecoration: 'none',
        });
    });

});
