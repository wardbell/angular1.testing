var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Jasmine in action
 * Jasmine docs: http://jasmine.github.io/2.3/introduction.html
 */
describe('1st tests', function () {
    it('true is true', function () { return expect(true).toEqual(true); });
    it('null is not the same thing as undefined', function () { return expect(null).not.toEqual(undefined); });
    // A deliberately failing test. 
    // `xit` renders it inert but shows as pending
    // remove 'x' to see it fail
    xit('null IS the same thing as undefined (failing test)', function () { return expect(null).toEqual(undefined); });
    describe('Nested #1', function () {
        var local = 1;
        it('local should equal 1', function () { return expect(local).toEqual(1); });
    });
    describe('Nested #2', function () {
        var local = 2;
        it('local should equal 2', function () { return expect(local).toEqual(2); });
    });
    describe('beforeEach', function () {
        var local;
        beforeEach(function () {
            local = 3;
        });
        it('local should equal 3', function () { return expect(local).toEqual(3); });
        it('(local += 1) should equal 4', function () { return expect(local += 1).toEqual(4); });
        // local is re-initialized by `beforeEach`
        it('local should equal 3 again (thanks to beforEach)', function () { return expect(local).toEqual(3); });
    });
    describe('other common matchers', function () {
        var a = { x: 1, y: 'y' };
        var b = { y: 'y', x: 1 }; // property order shouldn't matter
        var c = { x: 1, y: 'y', z: true }; // like a but w/ extra property
        it('"toEqual" works for objects', function () {
            expect(b).toEqual(a);
        });
        it('an object w/ extra property is not equal', function () {
            expect(c).not.toEqual(a);
        });
        it('"objectContaining" to partial match properties in an object', function () {
            expect(c).toEqual(jasmine.objectContaining(a));
        });
        it('"toBe" matches identity w/ ===', function () {
            expect(a).toBe(a);
            expect(a).not.toBe(b);
        });
        it('"toMatch" uses regEx', function () {
            expect('How Now Brown Cow').toMatch(/now/i);
        });
        it('"contains" for matching one value in a simple array', function () {
            expect([1, 2, 3, 4]).toContain(2);
            expect([1, 2, 3, 4]).not.toContain(0);
        });
        it('"contains" for matching one value in object arrays (object identity)', function () {
            expect([a, b]).toContain(b);
        });
        it('"contains" for object arrays (object value equality)', function () {
            expect([a, b]).toContain({ x: 1, y: 'y' });
        });
        it('"arrayContaining" for matching several values in an array', function () {
            expect([1, 2, 3, 4, 5]).toEqual(jasmine.arrayContaining([2, 5]));
            expect([1, 2, 3, 4, 5]).not.toEqual(jasmine.arrayContaining([2, 0, 5]));
        });
        // and much much more!
        // PLUS create your own "custom matcher"
        // http://jasmine.github.io/2.3/custom_matcher.html
    });
    describe('expect error', function () {
        var errMsg = 'deliberate error';
        var badData = { evil: 'Dr. Evil' };
        var badFn = function () {
            throw errMsg;
        };
        var badFnCustom = function () {
            throw new MyCustomError(errMsg, badData);
        };
        var goodFn = function () { return 'good'; };
        it('badFn throws error', function () { return expect(badFn).toThrow(); });
        it('badFnCustom throws error', function () { return expect(badFnCustom).toThrow(); });
        it('badFnCustom throws error w/ expected message', function () { return expect(badFnCustom).toThrowError(errMsg); });
        it('badFnCustom throws error w/ expected message (regEx)', function () { return expect(badFnCustom).toThrowError(/deliberate/); });
        it('badFnCustom throws error of expected custom error type (MyCustomError)', function () { return expect(badFnCustom).toThrowError(MyCustomError); });
        it('badFnCustom throws error of expected custom error type (MyCustomError) & message', function () { return expect(badFnCustom).toThrowError(MyCustomError, errMsg); });
        xit('goodFn throws error (failing test)', function () { return expect(goodFn).toThrow(); });
    });
    var MyCustomError = (function (_super) {
        __extends(MyCustomError, _super);
        function MyCustomError(message, data) {
            _super.call(this, message);
            this.message = message;
            this.data = data;
            this.name = 'MyCustomError';
        }
        return MyCustomError;
    })(Error);
});
