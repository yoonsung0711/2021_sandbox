const compose = require('./compose')

describe('Store Module: compose', () => {

    it('can handle single function', () => {
        const plus = (x) => x + 2;
        expect(compose(plus)(5)).toEqual(7);
    });

    it('evalutes values from right to left - 1', () => {
        const plus = (x) => x + 3;
        const square = (x) => x * x;
        expect(compose(plus, square)(2)).toEqual(7);
    });

    it('evalutes values from right to left - 2', () => {
        const square = (x) => x * x;
        const plus = (x) => x + 3;
        expect(compose(square, plus)(2)).toEqual(25);
    });

    it('evalutes function from left to right - 1', () => {
        const square = (next) => (x) => next(x * x);
        const plus = () => (x) => x + 3;
        expect(compose(square, plus)()(2)).toEqual(7);
    });

    it('evalutes function from left to right - 2', () => {
        const actual = ['Luke Skyway,'];
        const may = (next) => (actual) => {
            actual.push('may');
            next(actual);
        };
        const theForce = (next) => (actual) => {
            actual.push('the force');
            next(actual);
        };
        const beWith = (next) => (actual) => {
            actual.push('be with');
            next(actual);
        };
        const you = () => (actual) => {
            actual.push('you');
        };
        compose(may, theForce, beWith, you)()(actual);
        expect(actual.join(' ')).toEqual('Luke Skyway, may the force be with you');
    })

    it('need a identity-like function to collect final result', () => {
        const may = (next) => (x) => {
            const result = next(x + ', may');
            return result
        };
        const theForce = (next) => (x) => {
            const result = next(x + ' the force');
            return result
        };
        const beWith = (next) => (x) => {
            const result = next(x + ' be with');
            return result
        };
        const you = (next) => (x) => {
            const result = next(x + ' you');
            return result
        };
        const identity = (x) => x;
        expect(compose(may, theForce, beWith, you)(identity)('Luke Skyway')).toEqual('Luke Skyway, may the force be with you');
    })

    it('!!!This is a meaningless test for comparison!!!', () => {
        const actual = [];
        function may(actual) {
            actual.push('may-0')
            return function (next) {
                // actual.push('may-1')
                return(_actual) => {
                    // actual.push('may-2')
                    const result = next(_actual + ', may');
                    // actual.push('may-3')
                    return result
                }
            }
        };
        function theForce(actual) {
            actual.push('theForce-0')
            return function (next) {
                // actual.push('theForce-1')
                return(_actual) => {
                    // actual.push('theForce-2')
                    const result = next(_actual + ' the force');
                    // actual.push('theForce-3')
                    return result
                };
            }
        }
        function beWith(actual) {
            actual.push('beWith-0')
            return function (next) {
                // actual.push('beWith-1')
                return(_actual) => {
                    // actual.push('beWith-2')
                    const result = next(_actual + ' be with');
                    // actual.push('beWith-3')
                    return result
                };
            }
        }
        function you(actual) {
            actual.push('you-0')
            return function (next) {
                // actual.push('you-1')
                return(_actual) => {
                    // actual.push('you-2')
                    const result = next(_actual + ' you');
                    // actual.push('you-3')
                    return result
                };
            }
        }
        const identity = x => x;
        expect(compose(may(actual), theForce(actual), beWith(actual), you(actual))(identity)('Luke Skyway')).toEqual('Luke Skyway, may the force be with you');
        expect(actual).toEqual(['may-0', 'theForce-0', 'beWith-0', 'you-0'])
    })

    it('evaluation order of [region 1] is from right to left', () => {
        const actual = [];
        function may(actual) {
            // actual.push('may-0')
            return function (next) {
                actual.push('may-1')
                return(_actual) => {
                    // actual.push('may-2')
                    const result = next(_actual + ', may');
                    // actual.push('may-3')
                    return result
                }
            }
        };
        function theForce(actual) {
            // actual.push('theForce-0')
            return function (next) {
                actual.push('theForce-1')
                return(_actual) => {
                    // actual.push('theForce-2')
                    const result = next(_actual + ' the force');
                    // actual.push('theForce-3')
                    return result
                };
            }
        }
        function beWith(actual) {
            // actual.push('beWith-0')
            return function (next) {
                actual.push('beWith-1')
                return(_actual) => {
                    // actual.push('beWith-2')
                    const result = next(_actual + ' be with');
                    // actual.push('beWith-3')
                    return result
                };
            }
        }
        function you(actual) {
            // actual.push('you-0')
            return function (next) {
                actual.push('you-1')
                return(_actual) => {
                    // actual.push('you-2')
                    const result = next(_actual + ' you');
                    // actual.push('you-3')
                    return result
                };
            }
        }
        const identity = x => x;
        expect(compose(may(actual), theForce(actual), beWith(actual), you(actual))(identity)('Luke Skyway')).toEqual('Luke Skyway, may the force be with you');
        expect(actual).toEqual(['you-1', 'beWith-1', 'theForce-1', 'may-1'])
    })

    it('evaluation order of [region 2] is from left to right', () => {
        const actual = [];
        function may(actual) {
            // actual.push('may-0')
            return function (next) {
                // actual.push('may-1')
                return(_actual) => {
                    actual.push('may-2')
                    const result = next(_actual + ', may');
                    // actual.push('may-3')
                    return result
                }
            }
        };
        function theForce(actual) {
            // actual.push('theForce-0')
            return function (next) {
                // actual.push('theForce-1')
                return(_actual) => {
                    actual.push('theForce-2')
                    const result = next(_actual + ' the force');
                    // actual.push('theForce-3')
                    return result
                };
            }
        }
        function beWith(actual) {
            // actual.push('beWith-0')
            return function (next) {
                // actual.push('beWith-1')
                return(_actual) => {
                    actual.push('beWith-2')
                    const result = next(_actual + ' be with');
                    // actual.push('beWith-3')
                    return result
                };
            }
        }
        function you(actual) {
            // actual.push('you-0')
            return function (next) {
                // actual.push('you-1')
                return(_actual) => {
                    actual.push('you-2')
                    const result = next(_actual + ' you');
                    // actual.push('you-3')
                    return result
                };
            }
        }
        const identity = x => x;
        expect(compose(may(actual), theForce(actual), beWith(actual), you(actual))(identity)('Luke Skyway')).toEqual('Luke Skyway, may the force be with you');
        expect(actual).toEqual([ 'may-2', 'theForce-2', 'beWith-2', 'you-2' ])
    })

    it('evaluation order of [region 3] is from right to left', () => {
        const actual = [];
        function may(actual) {
            // actual.push('may-0')
            return function (next) {
                // actual.push('may-1')
                return(_actual) => {
                    // actual.push('may-2')
                    const result = next(_actual + ', may');
                    actual.push('may-3')
                    return result
                }
            }
        };
        function theForce(actual) {
            // actual.push('theForce-0')
            return function (next) {
                // actual.push('theForce-1')
                return(_actual) => {
                    // actual.push('theForce-2')
                    const result = next(_actual + ' the force');
                    actual.push('theForce-3')
                    return result
                };
            }
        }
        function beWith(actual) {
            // actual.push('beWith-0')
            return function (next) {
                // actual.push('beWith-1')
                return(_actual) => {
                    // actual.push('beWith-2')
                    const result = next(_actual + ' be with');
                    actual.push('beWith-3')
                    return result
                };
            }
        }
        function you(actual) {
            // actual.push('you-0')
            return function (next) {
                // actual.push('you-1')
                return(_actual) => {
                    // actual.push('you-2')
                    const result = next(_actual + ' you');
                    actual.push('you-3')
                    return result
                };
            }
        }
        const identity = x => x;
        expect(compose(may(actual), theForce(actual), beWith(actual), you(actual))(identity)('Luke Skyway')).toEqual('Luke Skyway, may the force be with you');
        expect(actual).toEqual([ 'you-3', 'beWith-3', 'theForce-3', 'may-3' ])
    })

})
