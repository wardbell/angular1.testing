var appT02;
(function (appT02) {
    // export the class for its interface during testing
    var AppController = (function () {
        function AppController(config, _dataservice) {
            this._dataservice = _dataservice;
            var serverLocation = config.useBreeze ? config.apiHost : 'memory';
            this.dataSource = "Serving data from " + serverLocation;
        }
        Object.defineProperty(AppController.prototype, "customers", {
            get: function () {
                // Note $digest error (infinite loop) if you implement as
                // return this._getAllCustomers();
                return this._customers || this._getAllCustomers();
            },
            enumerable: true,
            configurable: true
        });
        AppController.prototype.onSelect = function (cust) {
            this.currentCustomer = cust;
        };
        /////////
        AppController.prototype._getAllCustomers = function () {
            var _this = this;
            this._dataservice.getAllCustomers()
                .then(function (custs) { return _this._customers = custs; });
            return this._customers;
        };
        AppController.$inject = ['config', 'Dataservice']; // near the constructor!
        return AppController;
    })();
    appT02.AppController = AppController;
    angular.module('app')
        .controller('AppController', AppController);
})(appT02 || (appT02 = {}));
