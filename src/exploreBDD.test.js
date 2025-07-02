import { expect } from 'chai';

describe('Basic Assertions', () => {
    it('Number_equal', () => {
        expect(2 + 3).to.equal(5)
    });

    it('Number_not_equal', () => {
        expect(2 + 3).to.not.equal(6)
    });

    it('String_equal', () => {
        expect('DongThin').to.equal('DongThin')
    });

    it('Array_Deep equal', () => {
        expect(['DT', 'Al']).to.deep.equal(['DT', 'Al']);
    });

    it('Obj_Not deep equal', () => {
        const actual = { name: 'Kien', age: 29 };
        const expected = { name: 'Thin', age: 25 };
        expect(actual).to.not.deep.equal(expected);
    });

    function sayHello(name) {
        return `Hello, ${name}`;
    }

    it('Obj_Equal', () => {
        function getUser() {
            return {
                name: 'DongThin',
                age: 18,
            }
        }
        const user = getUser();
        expect(user).to.have.property('name').that.is.a('string');
        expect(user).to.have.property('age').that.is.a('number');
        expect(user.age).to.be.within(18, 30);
        expect(user).to.deep.equal({ name: 'DongThin', age: 18, })
    })

    it('Literal Expression_Equal', () => {
        const name = 'DongThin';
        expect(sayHello(name)).to.equal('Hello, DongThin');
    });

})
describe('Booleans/Truthiness', () => {
    it('Booolean values_True', () => {
        expect(true).to.equal(true);
    })
    it('Booolean values_False', () => {
        expect(false).to.equal(false);
    })
    it('Truthy_True', () => {
        expect(1).to.be.ok;
    })

    it('Falsy_False', () => {
        expect(0).to.be.not.ok;
        expect('').to.be.not.ok;
    })
})
describe('Null / Undefined', () => {

    it('Null', () => {
        const x = null;
        expect(x).to.be.null;
    })
    it('Not null', () => {
        expect(1).to.not.be.null;
        expect('').to.not.be.null;
        expect(true).to.not.be.null;
        expect({}).to.not.be.null;
    })
    it('should be undefined when declared without value', () => {
        let y;
        expect(y).to.be.undefined;
    })

})

describe('Type Checking', () => {
    it('a string', () => {
        expect('DongThin').to.be.a('string')
    })
    it('a number', () => {
        expect(18).to.be.a('number')
    })
    it('an array', () => {
        expect(['test', 'debug']).to.be.an('array')
    })
    it('an obj', () => {
        expect({ name: 'DongThin' }).to.be.an('object')

    })
})
describe('Collections and Properties', () => {
    it('Include', () => {
        expect([1, 2, 3]).to.include(2);
        expect([1, 2, 3]).to.include.members([1, 2]);
        expect('chai testing').to.include('chai');
        expect({ name: 'DongThin', age: 18 }).to.have.property('name').that.equals('DongThin');
        expect({ name: 'DongThin' }).to.have.all.keys('name');
    })
})
describe('.lengthOf(n)', () => {
    it('array', () => {
        const arr = [1, 2, 3];
        expect(arr).to.have.lengthOf(3);
        expect(arr).to.have.lengthOf.at.least(2);
        expect(arr).to.have.lengthOf.at.most(4);
        expect(arr).to.have.lengthOf.within(2, 4);
        expect(arr).to.have.lengthOf(3, 'Array length is not 3');

    })

    it('string', () => {
        const string = 'DongThin';
        expect(string).to.have.lengthOf(8);
        expect(string).to.have.lengthOf.at.least(5);
        expect(string).to.have.lengthOf.at.most(10);
        expect(string).to.have.lengthOf.within(5, 10);
        expect(string).to.have.lengthOf(8, 'String length is not 8');

    })

    it('object', () => {
        const obj = { name: 'DongThin', age: 18 };
        expect(Object.keys(obj)).to.have.lengthOf(2);
        expect(Object.keys(obj)).to.have.lengthOf.at.least(1);
        expect(Object.keys(obj)).to.have.lengthOf.at.most(3);
        expect(Object.keys(obj)).to.have.lengthOf.within(1, 3);
        expect(Object.keys(obj)).to.have.lengthOf(2, 'Object length is not 2');

    })
})
describe('Comparison', () => {
    it('score', () => {
        const score = 95;
        expect(score).to.be.gt(90);
        expect(score).to.be.lte(100);
        expect(score).to.be.within(95, 100);
        expect(score).to.be.at.least(5);
    })
})

describe('Regex/ Strings', () => {
    it('should contain substring using .string()', () => {
        const msg = 'Welcome to BDD testing!';
        expect(msg).to.have.string('BDD');
        expect(msg).to.have.string('testing');
    });

    it('should match regex pattern using .match()', () => {
        const email = 'dongthin@example.com';
        expect(email).to.match(/@example\.com$/);
        expect(email).to.match(/^[a-z]+@[a-z]+\.[a-z]{2,}$/);
    });

    it('should validate name pattern', () => {
        const username = 'DongThin2024';
        expect(username).to.match(/[A-Z][a-z]+[0-9]+/);
    });
})

function divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Inputs must be numbers');
    }
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}

describe('throw error', () => {

    it('throw error', () => {
        expect(() => divide(4, 0)).to.throw('Cannot divide by zero');
        expect(() => divide(4, '2')).to.throw(TypeError, 'Inputs must be numbers');
        expect(() => divide('4', 2)).to.throw(TypeError, 'Inputs must be numbers');
        expect(() => divide(4, 2)).to.not.throw();
    })
})

describe('', () => {
    describe('Instance / Inheritance', () => {
        it('should check instances', () => {
            const arr = [1, 2, 3];
            const date = new Date();
            const err = new TypeError('Something went wrong');

            expect(arr).to.be.instanceOf(Array);
            expect(date).to.be.instanceOf(Date);
            expect(err).to.be.instanceOf(Error);
            expect(err).to.be.instanceOf(TypeError);    // TypeError is a Error
        });
    });

})
