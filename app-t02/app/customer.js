var appT02;
(function (appT02) {
    var Customer = (function () {
        function Customer(id, firstName, lastName) {
            if (id === void 0) { id = 0; }
            if (firstName === void 0) { firstName = '<first>'; }
            if (lastName === void 0) { lastName = '<last>'; }
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        Object.defineProperty(Customer.prototype, "fullName", {
            get: function () { return this.firstName + " " + this.lastName; },
            enumerable: true,
            configurable: true
        });
        return Customer;
    })();
    appT02.Customer = Customer;
})(appT02 || (appT02 = {}));
