/* Jasmine in action 
 * Jasmine docs: http://jasmine.github.io/2.3/introduction.html
 */
describe('1st tests', () => {

    it('true is true', () => expect(true).toEqual(true));

    it('null is not the same thing as undefined',
        () => expect(null).not.toEqual(undefined)
    );

    // A deliberately failing test. 
    // `xit` renders it inert but shows as pending
    // remove 'x' to see it fail
    xit('null IS the same thing as undefined (failing test)',
        () => expect(null).toEqual(undefined)
    );



    describe('Nested #1', () => {
        let local = 1;
        it('local should equal 1', () => expect(local).toEqual(1));
    })

    describe('Nested #2', () => {
        let local = 2;
        it('local should equal 2', () => expect(local).toEqual(2));
    })

    describe('beforeEach', () => {

        let local: number;

        beforeEach(() => {
            local = 3;
        });

        it('local should equal 3', () => expect(local).toEqual(3));
        it('(local += 1) should equal 4', () => expect(local += 1).toEqual(4));
        // local is re-initialized by `beforeEach`
        it('local should equal 3 again (thanks to beforEach)', () => expect(local).toEqual(3));

    });


    describe('other common matchers', () => {

        let a = { x: 1, y: 'y' };
        let b = { y: 'y', x: 1 }; // property order shouldn't matter
        let c = { x: 1, y: 'y', z: true }; // like a but w/ extra property

        it('"toEqual" works for objects', () => {
            expect(b).toEqual(a);
        });

        it('an object w/ extra property is not equal', () => {
            expect(c).not.toEqual(a);
        });

        it('"objectContaining" to partial match properties in an object', () => {
            expect(c).toEqual(jasmine.objectContaining(a));
        });

        it('"toBe" matches identity w/ ===', () => {
            expect(a).toBe(a);
            expect(a).not.toBe(b);
        });

        it('"toMatch" uses regEx', () => {
            expect('How Now Brown Cow').toMatch(/now/i);
        });

        it('"contains" for matching one value in a simple array', () => {
            expect([1, 2, 3, 4]).toContain(2);
            expect([1, 2, 3, 4]).not.toContain(0);
        });

        it('"contains" for matching one value in object arrays (object identity)', () => {
            expect([a, b]).toContain(b);
        });

        it('"contains" for object arrays (object value equality)', () => {
            expect([a, b]).toContain({ x: 1, y: 'y' });
        });

        it('"arrayContaining" for matching several values in an array', () => {
            expect([1, 2, 3, 4, 5]).toEqual(jasmine.arrayContaining([2, 5]));
            expect([1, 2, 3, 4, 5]).not.toEqual(jasmine.arrayContaining([2, 0, 5]));
        });

        // and much much more!

        // PLUS create your own "custom matcher"
        // http://jasmine.github.io/2.3/custom_matcher.html
    });


    describe('expect error', () => {

        let errMsg = 'deliberate error';
        let badData = { evil: 'Dr. Evil' };

        let badFn = () => {
            throw errMsg;
        };

        let badFnCustom = () => {
            throw new MyCustomError(errMsg, badData)
        };

        let goodFn = () => 'good';

        it('badFn throws error', () => expect(badFn).toThrow());

        it('badFnCustom throws error', () => expect(badFnCustom).toThrow());

        it('badFnCustom throws error w/ expected message',
            () => expect(badFnCustom).toThrowError(errMsg)
        );

        it('badFnCustom throws error w/ expected message (regEx)',
            () => expect(badFnCustom).toThrowError(/deliberate/)
        );

        it('badFnCustom throws error of expected custom error type (MyCustomError)',
            () => expect(badFnCustom).toThrowError(MyCustomError)
        );

        it('badFnCustom throws error of expected custom error type (MyCustomError) & message',
            () => expect(badFnCustom).toThrowError(MyCustomError, errMsg)
        );

        xit('goodFn throws error (failing test)',
            () => expect(goodFn).toThrow()
        );

    });

    class MyCustomError extends Error {
        name = 'MyCustomError';
        constructor(public message?: string, public data?:any) {
            super(message);
        }
    }

});