namespace appT02 {
    export class Customer {
        constructor(
            public id: number = 0,
            public firstName: string = '<first>',
            public lastName: string = '<last>'
        ) { }

        get fullName() { return `${this.firstName} ${this.lastName}` }
    }
}