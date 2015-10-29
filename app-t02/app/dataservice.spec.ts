namespace appT02 {
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
    let module = angular.mock.module;
    let inject = angular.mock.inject;

    describe('Dataservice', () => {

        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));
        beforeEachSafeConfig(); // calls injector; module definitions now frozen

        describe('Dataservice', () => {

            it('is the "SlowInMemDataservice"', inject((Dataservice: Dataservice) => {
                expect(Dataservice.name).toEqual('SlowInMemDataservice');
            }));

        });     



        describe('InMemDataservice', () => {

            describe('creation', () => {

                it('can create service when "useBreeze" is false',
                    inject(['InMemDataservice', (service: Dataservice) => {
                        expect(service).toBeDefined();
                    }]));


                it('service throws when "useBreeze" is true',
                    inject((config:Config, $injector: any) => {
                        config.useBreeze = true;
                        expect(() => {
                            let service: Dataservice = $injector.get('InMemDataservice');
                        }).toThrowError(/memory/); // "memory" appears in error message
                    }));
            });

            // Method returns a $q promise
            // angular-mocks mocks $q so that tester can control promise resolution
            // To test any service relying on $q
            // we have to manipulate the mocked version of $q to 
            // tell it when to fullfill the promise
            // by calling $rootScope.$apply().
            describe('#getAllCustomers', () => {

                let $rootScope: angular.IScope;
                let service: Dataservice;

                beforeEach(inject(['$rootScope', 'InMemDataservice',
                    (_$rootScope_: angular.IScope, svc: Dataservice) => {
                        $rootScope = _$rootScope_;
                        service = svc;
                }]));

                it('returns customers when promise resolves', () => {
                    let custs: Customer[];
                    service.getAllCustomers()
                        .then(results => custs = results);

                    $rootScope.$apply(); // to flush $q else test fails because promise not resolved
                    expect(custs.length).toBeGreaterThan(0);
                });

            });
        });



        describe('SlowInMemDataservice', () => {

            // Uses $timeout to simulate latency of 1 second
            // We don't want this test to take 1 second 
            // (and have not yet learned how to make it wait that long)
            //
            // To test any service that uses $timeout to managee passage of time
            // we have to manipulate the mocked version of $timeout to 
            // accelerate/control time so that tests pass/fail quickly
            // See $timeout.flush().
            describe('#getAllCustomers', () => {

                let $timeout: angular.ITimeoutService;
                let service: Dataservice;

                beforeEach(inject(['$timeout', 'SlowInMemDataservice',
                    (_$timeout_: angular.ITimeoutService, svc: Dataservice) => {
                        $timeout = _$timeout_;
                        service = svc;
                    }]));

                it('returns customers after a delay when promise resolves ', () => {
                    let custs: Customer[];
                    service.getAllCustomers()
                        .then(results => custs = results);

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
            beforeEach(inject((config: Config) => config.useBreeze = false));
        }

    });
}