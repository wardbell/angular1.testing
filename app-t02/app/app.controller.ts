namespace appT02 {
    // export the class for its interface during testing
    export class AppController {

        private _customers: Customer[]; // local copy of customers
        currentCustomer: Customer;
        dataSource: string;

        static $inject = ['config', 'Dataservice']; // near the constructor!

        constructor(config:Config, private _dataservice:Dataservice) {
            let serverLocation = config.useBreeze ? config.apiHost : 'memory';
            this.dataSource = `Serving data from ${serverLocation}`;
        }

        get customers() {
            // Note $digest error (infinite loop) if you implement as
            // return this._getAllCustomers();
            return this._customers || this._getAllCustomers();
        }

        onSelect(cust: Customer) {
            this.currentCustomer = cust;
        }

        /////////
        private _getAllCustomers() {
            this._dataservice.getAllCustomers()
                .then(custs => this._customers = custs);

            return this._customers;
        }
    }



    angular.module('app')
        .controller('AppController', AppController);
}
