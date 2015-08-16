var formatDeclaration = require('../src/formatDeclaration');

describe('formatDeclaration', function () {

    it('should format a simple declaration', function () {
        formatDeclaration('color', 'red').should.equal('color:red;');
    });

    it('should support camelcased declarations', function () {
        formatDeclaration('lineHeight', '1').toLowerCase()
            .should.equal('line-height:1;');

        formatDeclaration('MozBorderBox', 'box-sizing').toLowerCase()
            .should.equal('-moz-border-box:box-sizing;');
    });

    it('should repeat array values', function () {
        formatDeclaration('border', ['blue', 'red'])
            .should.equal('border:red;\nborder:blue;');
    });

    it('should automatically add the px unit when value needs a unit', function () {
        formatDeclaration('border', 1)
            .should.equal('border:1px;');

        formatDeclaration('borderWidth', [1, 2])
            .should.equal('border-Width:2px;\nborder-Width:1px;');
    });

    it('should not add the px unit when the unit is not needed', function () {
        formatDeclaration('lineHeight', 1).toLowerCase()
            .should.equal('line-height:1;');

        formatDeclaration('zIndex', 1).toLowerCase()
            .should.equal('z-index:1;');

        formatDeclaration('flex', [2, 1]).toLowerCase()
            .should.equal('flex:1;\nflex:2;');
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
