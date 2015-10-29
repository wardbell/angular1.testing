var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var appT02;
(function (appT02) {
    var InMemDataservice = (function () {
        function InMemDataservice(config, _$q) {
            this._$q = _$q;
            this.name = 'InMemDataservice';
            if (config.useBreeze) {
                throw new Error('Config.useBreeze is true but this is an in-memory data source');
            }
        }
        InMemDataservice.prototype.getAllCustomers = function () {
            return this._$q.when(appT02.mockCustomers);
        };
        InMemDataservice.$inject = ['config', '$q'];
        return InMemDataservice;
    })();
    // Simulates network latency by waiting before returning customers
    var DELAY = 1000;
    var SlowInMemDataservice = (function (_super) {
        __extends(SlowInMemDataservice, _super);
        function SlowInMemDataservice(config, _$q, _$timeout) {
            _super.call(this, config, _$q);
            this._$timeout = _$timeout;
            this.name = 'SlowInMemDataservice';
        }
        SlowInMemDataservice.prototype.getAllCustomers = function () {
            var deferred = this._$q.defer();
            this._$timeout(function () { return deferred.resolve(appT02.mockCustomers); }, DELAY);
            return deferred.promise;
        };
        SlowInMemDataservice.$inject = ['config', '$q', '$timeout'];
        return SlowInMemDataservice;
    })(InMemDataservice);
    angular.module('app')
        .service('InMemDataservice', InMemDataservice)
        .service('SlowInMemDataservice', SlowInMemDataservice)
        .service('Dataservice', SlowInMemDataservice);
})(appT02 || (appT02 = {}));
