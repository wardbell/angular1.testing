namespace appT02 {
    /*
       Testing a controller
       
       Features include:
       * using the $controller service to get an instance of the controller
       * synchronous testing when the controller relies on an async dependency
       * injection of a mocked dependency (dataservice)
       * injecting that dependency in beforeEach and mocking it before use by service
       * replacing the dataservice definition in the module with the mock
       * mock flavors
         - null
         - spy
         - spy/stub the real service
         - happy fake (supplied to controller instance)
         - happy fake (replaces real service in the module definition)
         - throwing fake (replaces real service in the module definition)

       See dataservice.spec lesson for testing in-memory dataservice like the mock.
     */

    // friendly aliases
    let module = angular.mock.module;
    let inject = angular.mock.inject;

    describe('AppController', () => {

        // Angular's controller factory service
        let $controller: angular.IControllerService; 

        // Angular's $rootScope ... so we can flush queues and DOM watchers
        let $rootScope: angular.IScope;

        let controller: AppController;
        let controllerName = 'AppController';

        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));

        describe('(real dataservice)', () => {

            beforeEach(inject((_$controller_: angular.IControllerService) => {

                $controller = _$controller_;

                // appController's ctor signature: constructor(config:Config, dataservice:Dataservice) 
                // Angular supplies both when its $controller service creates the instance
                controller = $controller(controllerName);
            }));

            it('can create', () => expect(controller).toBeDefined());

            it('has no currentCustomer',
                () => expect(controller.currentCustomer).not.toBeDefined()
            );

            it('has no customers immediately, must wait for server results .. but how?', () => {

                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                let custs = controller.customers; 

                expect(!!custs && custs.length > 0).toEqual(false);

                // how do we know when the server replies?
                // how do we wait?
                // do we really want a unit test contacting the server???
            });
        });

        ///// Fake or stub the dataservice from here on /////

        describe('(null dataservice)', () => {

            beforeEach(inject((_$controller_: angular.IControllerService) => {

                $controller = _$controller_;

                // appController's ctor signature: constructor(config:Config, dataservice:Dataservice) 
                // We supply a null dataservice in the 'locals' parameter
                // We did not supply `config` so Ng injects it
                controller = $controller(controllerName, { Dataservice: null });
            }));

            it('can create', () => expect(controller).toBeDefined());

            it('has no currentCustomer',
                () => expect(controller.currentCustomer).not.toBeDefined()
            );

            it('throws if we ask for customers', () => {
                // because the dataservice is a null object
                expect( () => controller.customers ).toThrowError(TypeError);
            });

        });

        
        describe('(spy/stub method of real dataservice [most common])', () => {

            let dataservice: Dataservice;

            beforeEach(inject((
                _$controller_: angular.IControllerService,
                Dataservice: Dataservice,
                $q: angular.IQService,
                _$rootScope_: angular.IScope) => {

                dataservice = Dataservice; // real service

                // spy and stub on the real service method
                spyOn(dataservice, 'getAllCustomers')
                    .and.callFake(() => $q.when(mockCustomers));

                resetMockCustomers();

                $rootScope = _$rootScope_;
                $controller = _$controller_;

                // let Angular inject our stubbed real service
                controller = $controller(controllerName);
            }));

            it('calls dataservice.getAllCustomers when "customers" property is accessed', () => {

                // triggers service call as side-effect
                let custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();

            });

            it('has customers after dataservice supplies them', () => {

                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                let custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(false);

                $rootScope.$apply(); // flush pending promises

                // "bind" to customers again
                custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(true);
            });

        });


        describe('(supply spy dataservice)', () => {

            let spyDataservice: Dataservice;

            beforeEach(inject((
                _$controller_: angular.IControllerService,
                $q: angular.IQService,
                _$rootScope_: angular.IScope) => {

                spyDataservice = {
                    name: 'spyDataservice',
                    getAllCustomers:
                    jasmine.createSpy('getAllCustomers')
                        .and.callFake(() => $q.when(mockCustomers))
                };

                resetMockCustomers();

                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName, { Dataservice: spyDataservice });
            }));

            it('calls dataservice.getAllCustomers when "customers" property is accessed', () => {

                // triggers service call as side-effect
                let custs = controller.customers;
                expect(spyDataservice.getAllCustomers).toHaveBeenCalled();

            });

            it('has customers after dataservice supplies them', () => {

                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                let custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(false);

                $rootScope.$apply(); // flush pending promises

                // "bind" to customers again
                custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(true);
            });

        });


        describe('(supply happy fake dataservice)', () => {

            let dataservice: Dataservice;

            beforeEach(inject((
                    _$controller_: angular.IControllerService,
                    $q: angular.IQService,
                    _$rootScope_: angular.IScope) => {

                dataservice = new HappyMockDataservice($q) 

                resetMockCustomers();

                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName, { Dataservice: dataservice});
            }));


            it('calls dataservice.getAllCustomers when "customers" property is accessed', () => {

                // triggers service call as side-effect
                let custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();

            });

            it('has customers after dataservice supplies them', () => {

                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                let custs = controller.customers; 

                expect(!!custs && custs.length > 0).toEqual(false);

                $rootScope.$apply(); // flush pending promises

                // "bind" to customers again
                custs = controller.customers; 

                expect(!!custs && custs.length > 0).toEqual(true);
            });

        });


        describe('(replace with happy fake dataservice)', () => {
            // replace definition of Dataservice w/ a happy fake
            beforeEach(module(
                $provide => { $provide.service('Dataservice', HappyMockDataservice) }
            ));

            beforeEach(inject((
                _$controller_: angular.IControllerService,
                _$rootScope_: angular.IScope) => {

                resetMockCustomers();

                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName);
            }));

            it('has customers after dataservice supplies them', () => {

                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                let custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(false);

                $rootScope.$apply(); // flush pending promises

                // "bind" to customers again
                custs = controller.customers;

                expect(!!custs && custs.length > 0).toEqual(true);
            });

        });
 

        describe('(replace with fake dataservice that fails)', () => {

            let dataservice: Dataservice;

            // replace definition of Dataservice w/ a happy fake
            beforeEach(module(
                $provide => { $provide.service('Dataservice', ThrowingMockDataservice) }
            ));

            beforeEach(inject((
                _$controller_: angular.IControllerService,
                Dataservice: Dataservice,
                _$rootScope_: angular.IScope) => {

                resetMockCustomers();

                dataservice = Dataservice;
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName);
            }));


            it('calls dataservice.getAllCustomers when "customers" property is accessed', () => {

                // triggers service call as side-effect
                let custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();

            });


            it('has no customers after dataservice throws', () => {

                // triggers service call as side-effect
                let custs = controller.customers;

                $rootScope.$apply();

                // No customers because service failed
                expect(!!custs && custs.length > 0).toEqual(false);        

            });

            it('dataservice threw expected error', () => {

                dataservice.getAllCustomers.call(0)
                    .then(() =>
                        fail('should have thrown error'))
                    .catch(error =>
                        expect(error).toMatch(/failed/i));

                // triggers service call as side-effect
                let custs = controller.customers;

                $rootScope.$apply()

            });
        });

        ///// helpers /////

        var mockCustomers: Customer[];

        function resetMockCustomers() {
            mockCustomers = [
                new Customer(42, 'Foo', 'Fighter'),
                new Customer(88, 'Piano', 'Keys'),
                new Customer(11, 'Uno', 'Numero')
            ];
        }

        class HappyMockDataservice implements Dataservice {
            name = 'HappyMockDataservice';

            static $inject = ['$q'];
            constructor(private _$q: angular.IQService) { }

            getAllCustomers =
                jasmine.createSpy('getAllCustomers')
                    .and.callFake(() => this._$q.when(mockCustomers))
        }

        var SERVER_FAILED_MSG = 'Server Failed: simulated error';
        var GETALL_FAILED_MSG = 'dataservice.getAllMethod threw: simulated error';

        class ThrowingMockDataservice implements Dataservice {
            name = 'ThrowingMockDataservice';

            static $inject = ['$q'];
            constructor(private _$q: angular.IQService) { }

            getAllCustomers =
                jasmine.createSpy('getAllCustomers')
                    .and.callFake(() => this._$q.reject(SERVER_FAILED_MSG));

            // Version that throws before it even gets to server
            //getAllCustomers =
            //    // force-cast to expected function type
            //    <() => angular.IPromise<Customer[]>><any>
            //    jasmine.createSpy('getAllCustomers')
            //        .and.throwError(GETALL_FAILED_MSG);
        }

    });
}