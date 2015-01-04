require('should');
var Style = require('../src/Style');

describe('Style', function () {
    var backend;
    beforeEach(function () {
        backend = {
            removeCalledWith: [],
            remove: function (o) {
                this.removeCalledWith.push(o);
            },
        };
    });

    describe('remove', function () {

        it('should remove a style', function () {
            var s = new Style(backend, 'style-1');
            s.remove();
            s.active.should.be.false;
            backend.removeCalledWith.should.eql(['style-1']);
        });

        it('should remove children styles', function () {
            var parent = new Style(backend, 'style-1');
            var s = new Style(backend, 'style-2', [parent]);
            parent.remove();
            s.active.should.be.false;
            parent.active.should.be.false;
            backend.removeCalledWith.should.eql(['style-2', 'style-1']);
        });

        it('should ignore the removal twice', function () {
            var s = new Style(backend, 'style-1');
            s.remove();
            s.remove();
            backend.removeCalledWith.should.eql(['style-1']);
        });

    });

    describe('toString', function () {

        it('should return a valid className', function () {
            var s = new Style(backend, 'style-1');
            String(s).should.equal('style-1 ');
        });

        it('should return the inherited classes as well', function () {
            var s = new Style(backend, 'style-3', [
                new Style(backend, 'parent-1'),
                new Style(backend, 'parent-2'),
            ]);
            String(s).should.equal('style-3 parent-1 parent-2 ');
        });

    });

    describe('classes', function () {

        it('should return a valid className', function () {
            var s = new Style(backend, 'style-1');
            s.classes.should.eql(['style-1']);
        });

        it('should return the inherited classes as well', function () {
            var s = new Style(backend, 'style-3', [
                new Style(backend, 'parent-1'),
                new Style(backend, 'parent-2'),
            ]);
            s.classes.should.eql(['style-3', 'parent-1', 'parent-2']);
        });

    });

    // describe('apply', function () {

    //     function ElementMock() {
    //         this.classList = {
    //             add: Array.prototype.push,
    //             length: 0
    //         };
    //     }

    //     it('should add the class name', function () {
    //         var s = new Style({});
    //         var element = new ElementMock();
    //         s.apply(element);
    //         element.classList.length.should.equal(1);
    //         element.classList[0].should.equal('style-1');
    //     });

    //     it('should add inheriting class names too', function () {
    //         var parent = new Style('parent', {});
    //         var child = new Style('child', { inherit: parent });
    //         var element = new ElementMock();
    //         child.apply(element);
    //         element.classList.length.should.equal(2);
    //         element.classList[0].should.equal('parent-1');
    //         element.classList[1].should.equal('child-2');
    //     });

    //     it('should add inheriting class names too with multiple parents', function () {
    //         var parent = new Style('parent', {});
    //         var parent2 = new Style('parent', {});
    //         var child = new Style('child', { inherit: [parent, parent2] });
    //         var element = new ElementMock();
    //         child.apply(element);
    //         element.classList.length.should.equal(3);
    //         element.classList[0].should.equal('parent-1');
    //         element.classList[1].should.equal('parent-2');
    //         element.classList[2].should.equal('child-3');
    //     });

    //     it('should deduplicate class names', function () {
    //         var parent = new Style('parent', {});
    //         var parent2 = new Style('parent', { inherit: parent });
    //         var child = new Style('child', { inherit: [parent, parent2] });
    //         var element = new ElementMock();
    //         child.apply(element);
    //         element.classList.length.should.equal(3);
    //         element.classList[0].should.equal('parent-1');
    //         element.classList[1].should.equal('parent-2');
    //         element.classList[2].should.equal('child-3');
    //     });

    // });

});
