var appT02;
(function (appT02) {
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
    var module = angular.mock.module;
    var inject = angular.mock.inject;
    describe('AppController', function () {
        // Angular's controller factory service
        var $controller;
        // Angular's $rootScope ... so we can flush queues and DOM watchers
        var $rootScope;
        var controller;
        var controllerName = 'AppController';
        // Identify module to test
        // could replace any definitions at this point
        beforeEach(module('app'));
        describe('(real dataservice)', function () {
            beforeEach(inject(function (_$controller_) {
                $controller = _$controller_;
                // appController's ctor signature: constructor(config:Config, dataservice:Dataservice) 
                // Angular supplies both when its $controller service creates the instance
                controller = $controller(controllerName);
            }));
            it('can create', function () { return expect(controller).toBeDefined(); });
            it('has no currentCustomer', function () { return expect(controller.currentCustomer).not.toBeDefined(); });
            it('has no customers immediately, must wait for server results .. but how?', function () {
                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(false);
                // how do we know when the server replies?
                // how do we wait?
                // do we really want a unit test contacting the server???
            });
        });
        ///// Fake or stub the dataservice from here on /////
        describe('(null dataservice)', function () {
            beforeEach(inject(function (_$controller_) {
                $controller = _$controller_;
                // appController's ctor signature: constructor(config:Config, dataservice:Dataservice) 
                // We supply a null dataservice in the 'locals' parameter
                // We did not supply `config` so Ng injects it
                controller = $controller(controllerName, { Dataservice: null });
            }));
            it('can create', function () { return expect(controller).toBeDefined(); });
            it('has no currentCustomer', function () { return expect(controller.currentCustomer).not.toBeDefined(); });
            it('throws if we ask for customers', function () {
                // because the dataservice is a null object
                expect(function () { return controller.customers; }).toThrowError(TypeError);
            });
        });
        describe('(spy/stub method of real dataservice [most common])', function () {
            var dataservice;
            beforeEach(inject(function (_$controller_, Dataservice, $q, _$rootScope_) {
                dataservice = Dataservice; // real service
                // spy and stub on the real service method
                spyOn(dataservice, 'getAllCustomers')
                    .and.callFake(function () { return $q.when(mockCustomers); });
                resetMockCustomers();
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                // let Angular inject our stubbed real service
                controller = $controller(controllerName);
            }));
            it('calls dataservice.getAllCustomers when "customers" property is accessed', function () {
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();
            });
            it('has customers after dataservice supplies them', function () {
                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(false);
                $rootScope.$apply(); // flush pending promises
                // "bind" to customers again
                custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(true);
            });
        });
        describe('(supply spy dataservice)', function () {
            var spyDataservice;
            beforeEach(inject(function (_$controller_, $q, _$rootScope_) {
                spyDataservice = {
                    name: 'spyDataservice',
                    getAllCustomers: jasmine.createSpy('getAllCustomers')
                        .and.callFake(function () { return $q.when(mockCustomers); })
                };
                resetMockCustomers();
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName, { Dataservice: spyDataservice });
            }));
            it('calls dataservice.getAllCustomers when "customers" property is accessed', function () {
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(spyDataservice.getAllCustomers).toHaveBeenCalled();
            });
            it('has customers after dataservice supplies them', function () {
                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(false);
                $rootScope.$apply(); // flush pending promises
                // "bind" to customers again
                custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(true);
            });
        });
        describe('(supply happy fake dataservice)', function () {
            var dataservice;
            beforeEach(inject(function (_$controller_, $q, _$rootScope_) {
                dataservice = new HappyMockDataservice($q);
                resetMockCustomers();
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName, { Dataservice: dataservice });
            }));
            it('calls dataservice.getAllCustomers when "customers" property is accessed', function () {
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();
            });
            it('has customers after dataservice supplies them', function () {
                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(false);
                $rootScope.$apply(); // flush pending promises
                // "bind" to customers again
                custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(true);
            });
        });
        describe('(replace with happy fake dataservice)', function () {
            // replace definition of Dataservice w/ a happy fake
            beforeEach(module(function ($provide) { $provide.service('Dataservice', HappyMockDataservice); }));
            beforeEach(inject(function (_$controller_, _$rootScope_) {
                resetMockCustomers();
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName);
            }));
            it('has customers after dataservice supplies them', function () {
                // "bind" to customers; no customers at first
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(false);
                $rootScope.$apply(); // flush pending promises
                // "bind" to customers again
                custs = controller.customers;
                expect(!!custs && custs.length > 0).toEqual(true);
            });
        });
        describe('(replace with fake dataservice that fails)', function () {
            var dataservice;
            // replace definition of Dataservice w/ a happy fake
            beforeEach(module(function ($provide) { $provide.service('Dataservice', ThrowingMockDataservice); }));
            beforeEach(inject(function (_$controller_, Dataservice, _$rootScope_) {
                resetMockCustomers();
                dataservice = Dataservice;
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                controller = $controller(controllerName);
            }));
            it('calls dataservice.getAllCustomers when "customers" property is accessed', function () {
                // triggers service call as side-effect
                var custs = controller.customers;
                expect(dataservice.getAllCustomers).toHaveBeenCalled();
            });
            it('has no customers after dataservice throws', function () {
                // triggers service call as side-effect
                var custs = controller.customers;
                $rootScope.$apply();
                // No customers because service failed
                expect(!!custs && custs.length > 0).toEqual(false);
            });
            it('dataservice threw expected error', function () {
                dataservice.getAllCustomers.call(0)
                    .then(function () {
                    return fail('should have thrown error');
                })
                    .catch(function (error) {
                    return expect(error).toMatch(/failed/i);
                });
                // triggers service call as side-effect
                var custs = controller.customers;
                $rootScope.$apply();
            });
        });
        ///// helpers /////
        var mockCustomers;
        function resetMockCustomers() {
            mockCustomers = [
                new appT02.Customer(42, 'Foo', 'Fighter'),
                new appT02.Customer(88, 'Piano', 'Keys'),
                new appT02.Customer(11, 'Uno', 'Numero')
            ];
        }
        var HappyMockDataservice = (function () {
            function HappyMockDataservice(_$q) {
                var _this = this;
                this._$q = _$q;
                this.name = 'HappyMockDataservice';
                this.getAllCustomers = jasmine.createSpy('getAllCustomers')
                    .and.callFake(function () { return _this._$q.when(mockCustomers); });
            }
            HappyMockDataservice.$inject = ['$q'];
            return HappyMockDataservice;
        })();
        var SERVER_FAILED_MSG = 'Server Failed: simulated error';
        var GETALL_FAILED_MSG = 'dataservice.getAllMethod threw: simulated error';
        var ThrowingMockDataservice = (function () {
            function ThrowingMockDataservice(_$q) {
                var _this = this;
                this._$q = _$q;
                this.name = 'ThrowingMockDataservice';
                this.getAllCustomers = jasmine.createSpy('getAllCustomers')
                    .and.callFake(function () { return _this._$q.reject(SERVER_FAILED_MSG); });
            }
            ThrowingMockDataservice.$inject = ['$q'];
            return ThrowingMockDataservice;
        })();
    });
})(appT02 || (appT02 = {}));
