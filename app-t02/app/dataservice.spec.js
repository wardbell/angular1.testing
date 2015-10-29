var appT02;
(function (appT02) {
    /*
       Testing an IN MEMORY async dataservice
       
       Features include:
       * injection of a dependency (config)
       * injecting that dependency in beforeEach and setting a value BEFORE it is used by service
       * injecting a particular implementation of dataservice into the test using annotation form
       * synchronous testing of a method that returns a promise
       * synchronous testing of a method that waits (using $timeout) before resolving a promise

       A real dataservice would make HTTP calls and probably could not be test this way
       The test techniques remain valuable tools in your kit
       (e.g. for testing controllers with mocked dataservices)
       See a related dataservice lesson for testing services that make HTTP calls.
     */
    // friendly aliases
    var module = angular.mock.module;
    var inject = angular.mock.inject;
    describe('Dataservice', function () {
        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));
        beforeEachSafeConfig(); // calls injector; module definitions now frozen
        describe('Dataservice', function () {
            it('is the "SlowInMemDataservice"', inject(function (Dataservice) {
                expect(Dataservice.name).toEqual('SlowInMemDataservice');
            }));
        });
        describe('InMemDataservice', function () {
            describe('creation', function () {
                it('can create service when "useBreeze" is false', inject(['InMemDataservice', function (service) {
                        expect(service).toBeDefined();
                    }]));
                it('service throws when "useBreeze" is true', inject(function (config, $injector) {
                    config.useBreeze = true;
                    expect(function () {
                        var service = $injector.get('InMemDataservice');
                    }).toThrowError(/memory/); // "memory" appears in error message
                }));
            });
            // Method returns a $q promise
            // angular-mocks mocks $q so that tester can control promise resolution
            // To test any service relying on $q
            // we have to manipulate the mocked version of $q to 
            // tell it when to fullfill the promise
            // by calling $rootScope.$apply().
            describe('#getAllCustomers', function () {
                var $rootScope;
                var service;
                beforeEach(inject(['$rootScope', 'InMemDataservice',
                    function (_$rootScope_, svc) {
                        $rootScope = _$rootScope_;
                        service = svc;
                    }]));
                it('returns customers when promise resolves', function () {
                    var custs;
                    service.getAllCustomers()
                        .then(function (results) { return custs = results; });
                    $rootScope.$apply(); // to flush $q else test fails because promise not resolved
                    expect(custs.length).toBeGreaterThan(0);
                });
            });
        });
        describe('SlowInMemDataservice', function () {
            // Uses $timeout to simulate latency of 1 second
            // We don't want this test to take 1 second 
            // (and have not yet learned how to make it wait that long)
            //
            // To test any service that uses $timeout to managee passage of time
            // we have to manipulate the mocked version of $timeout to 
            // accelerate/control time so that tests pass/fail quickly
            // See $timeout.flush().
            describe('#getAllCustomers', function () {
                var $timeout;
                var service;
                beforeEach(inject(['$timeout', 'SlowInMemDataservice',
                    function (_$timeout_, svc) {
                        $timeout = _$timeout_;
                        service = svc;
                    }]));
                it('returns customers after a delay when promise resolves ', function () {
                    var custs;
                    service.getAllCustomers()
                        .then(function (results) { return custs = results; });
                    $timeout.flush(); // to flush delays and incidentally flush $q
                    expect(custs.length).toBeGreaterThan(0);
                });
            });
        });
        ///// helpers /////
        // Although we can assume config.useBreeze is false for these demos (which it is)
        // That assumption could be unreliable.
        // We can force it false during these tests by running this method before creating the service
        function beforeEachSafeConfig() {
            beforeEach(inject(function (config) { return config.useBreeze = false; }));
        }
    });
})(appT02 || (appT02 = {}));
