var appT02;
(function (appT02) {
    // friendly aliases
    var module = angular.mock.module;
    var inject = angular.mock.inject;
    // There is very little reason to test config because it is
    // only a collection of values without any logic
    // Good for demo though. 
    // Can most easily show the basic outlines of Angular app test.
    describe('config', function () {
        var config;
        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));
        // once we inject, the module definitions are frozen
        beforeEach(inject(function (_config_) { return config = _config_; }));
        // This won't always be so!
        it('#useBreeze is false', function () { return expect(config.useBreeze).toEqual(false); });
        it('#appTitle says "breeze"', function () { return expect(config.appTitle).toMatch(/breeze/i); });
        it('#apiHost targets "breeze" server', function () { return expect(config.apiHost).toMatch(/breeze/i); });
    });
})(appT02 || (appT02 = {}));
