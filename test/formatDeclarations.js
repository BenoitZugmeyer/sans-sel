var formatDeclarations = require('../src/formatDeclarations');
var formatDeclaration = formatDeclarations.__test_formatDeclaration;

describe('formatDeclarations', function () {

    function collectRules(transforms) {
        return {
            fn: function (rule) {
                this.rules.push(rule);
            },
            rules: [],
            transforms: transforms || Object.create(null),
        };
    }

    it('should iterate over each rule of a declaration', function () {
        var declaration = {
            color: 'red',
            background: 'yellow',
        };

        var c = collectRules();
        formatDeclarations('.selector', declaration, c);
        c.rules.should.eql(['.selector{color:red;background:yellow;}']);
    });

    it('should add a media query if needed', function () {
        var declaration = {
            color: 'red',
            background: 'yellow',
        };

        var c = collectRules();
        formatDeclarations('.selector', declaration, c, '@media foo');
        c.rules.should.eql(['@media foo{.selector{color:red;background:yellow;}}']);
    });

    it('should ignore empty declarations', function () {
        var declaration = {};
        var c = collectRules();
        formatDeclarations('.selector', declaration, c, '@media foo');
        c.rules.should.eql([]);
    });

    it('should raise more rules for sub rules', function () {
        var declarations = {
            background: 'red',
            hover: {
                background: 'yellow',
            },
        };

        var c = collectRules();
        formatDeclarations('.selector', declarations, c);
        c.rules.should.eql([
            '.selector{background:red;}',
            '.selector:hover{background:yellow;}',
        ]);
    });

    it('should raise more rules for media', function () {
        var declarations = {
            background: 'red',
            'media screen': {
                background: 'yellow',
            },
        };

        var c = collectRules();
        formatDeclarations('.selector', declarations, c);
        c.rules.should.eql([
            '.selector{background:red;}',
            '@media screen{.selector{background:yellow;}}',
        ]);
    });

    describe('transforms', function () {

        function formatWithTransforms(selector, transforms, declarations) {
            var c = collectRules(transforms);
            formatDeclarations(selector, declarations, c);
            return c.rules;
        }

        it('should replace a simple value', function () {
            formatWithTransforms(
                '.selector',
                {
                    display: function (v) {
                        return {
                            display: '-webkit-' + v,
                        };
                    },
                },
                {
                    display: 'flex',
                }
            ).should.eql([
                '.selector{display:-webkit-flex;}',
            ]);
        });

        it('should be able to add more rules', function () {
            formatWithTransforms(
                '.selector',
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
            ).should.eql([
                '.selector{box-Sizing:border-box;-Moz-Box-Sizing:border-box;}',
            ]);
        });

        it('should be able to add more pseudo selectors', function () {
            formatWithTransforms(
                '.selector',
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
                    custom: true
                }
            ).should.eql([
                '.selector{text-Decoration:none;}',
                '.selector:hover{text-Decoration:underline;}',
            ]);
        });

        it('should be able to add more media queries', function () {
            formatWithTransforms(
                '.selector',
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
            ).should.eql([
                '@media foo{.selector{width:100px;}}',
            ]);
        });

        it('should be able to make another transform pass', function () {
            formatWithTransforms(
                '.selector',
                {
                    display: function (v) {
                        return {
                            display: '-webkit-' + v,
                        };
                    },

                    custom: function () {
                        return {
                            _recurse: true,
                            display: 'flex',
                            textDecoration: 'none',
                        };
                    },
                },
                {
                    custom: true
                }
            ).should.eql([
                '.selector{display:-webkit-flex;}',
                '.selector{text-Decoration:none;}',
            ]);
        });

    });

    describe('(private) formatDeclaration', function () {
        it('should format a simple declaration', function () {
            formatDeclaration('color', 'red').should.equal('color:red;');
        });

        it('should support camelcased declarations', function () {
            formatDeclaration('lineHeight', '1').toLowerCase()
                .should.equal('line-height:1;');

            formatDeclaration('MozBorderBox', 'box-sizing').toLowerCase()
                .should.equal('-moz-border-box:box-sizing;');
        });

        it('should join array values', function () {
            formatDeclaration('border', ['1px', 'solid', 'red'])
                .should.equal('border:1px solid red;');
        });

        it('should automatically add the px unit when value needs a unit', function () {
            formatDeclaration('border', 1)
                .should.equal('border:1px;');

            formatDeclaration('border', [1, 'solid', 'red'])
                .should.equal('border:1px solid red;');
        });

        it('should not add the px unit when the unit is not needed', function () {
            formatDeclaration('lineHeight', 1).toLowerCase()
                .should.equal('line-height:1;');

            formatDeclaration('zIndex', 1).toLowerCase()
                .should.equal('z-index:1;');

            formatDeclaration('flex', [2, 1]).toLowerCase()
                .should.equal('flex:2 1;');
        });

        it('should format the "content" property like a string', function () {
            formatDeclaration('content', 'foo')
                .should.equal('content:"foo";');
            formatDeclaration('content', 'foo bar')
                .should.equal('content:"foo bar";');
            formatDeclaration('content', 'foo "bar')
                .should.equal('content:"foo \\"bar";');
        });
    });
});


