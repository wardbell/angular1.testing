namespace appT02 {

    export interface Dataservice {
        getAllCustomers(): angular.IPromise<Customer[]>;
        name: string;
    }

    class InMemDataservice implements Dataservice {
        name = 'InMemDataservice';

        static $inject = ['config', '$q'];
        constructor(config: Config, protected _$q: angular.IQService) {
            if (config.useBreeze) {
                throw new Error('Config.useBreeze is true but this is an in-memory data source');
            }
        }

        getAllCustomers() {
            return this._$q.when(mockCustomers); 
        }
    }


    // Simulates network latency by waiting before returning customers
    const DELAY = 1000;

    class SlowInMemDataservice extends InMemDataservice {
        name = 'SlowInMemDataservice';

        static $inject = ['config', '$q', '$timeout'];
        constructor(config: Config, _$q: angular.IQService, private _$timeout: angular.ITimeoutService) {
            super(config, _$q);
        }

        getAllCustomers() {
            let deferred = this._$q.defer<Customer[]>();
            this._$timeout(() => deferred.resolve(mockCustomers), DELAY);
            return deferred.promise;
        }
    }


    angular.module('app')
        .service('InMemDataservice', InMemDataservice)
        .service('SlowInMemDataservice', SlowInMemDataservice)

        // Most consumers will ask for the 'Dataservice' and get this one:
        .service('Dataservice', SlowInMemDataservice);

}