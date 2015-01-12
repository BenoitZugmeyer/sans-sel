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
