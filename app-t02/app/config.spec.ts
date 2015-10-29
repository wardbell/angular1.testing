namespace appT02 {

    // friendly aliases
    let module = angular.mock.module;
    let inject = angular.mock.inject;

    // There is very little reason to test config because it is
    // only a collection of values without any logic
    // Good for demo though. 
    // Can most easily show the basic outlines of Angular app test.
    describe('config', () => {

        let config: Config;

        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));

        // once we inject, the module definitions are frozen
        beforeEach(inject((_config_: Config) => config = _config_));

        // This won't always be so!
        it('#useBreeze is false', () => expect(config.useBreeze).toEqual(false));

        it('#appTitle says "breeze"', () => expect(config.appTitle).toMatch(/breeze/i));

        it('#apiHost targets "breeze" server', () => expect(config.apiHost).toMatch(/breeze/i));


    });
}