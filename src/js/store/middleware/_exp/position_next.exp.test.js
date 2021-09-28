describe('Middleware: internals', () => {
    let stubStore;
    let compose;
    let createStoreForMiddlewareTest;
    beforeAll(() => {
        compose = (...funcs) => {
            return funcs.reduce((a, b) => (...args) => a(b(...args)));
        };
        stubStore = {
            dispatch: () => {}
        };
        createStoreForMiddlewareTest = require('#tests/middleware').createStoreForMiddlewareTest;
    })


    it.skip('sync blocking scenario', async () => {
        const middlewares = [
            (store) => (next) => (action) => {
                action.push([1, new Date().toISOString()]);
                next(action);
            },
            (store) => (next) => async (action) => {
                action.push([2, new Date().toISOString()]);
                action.push([
                    await new Promise(res => setTimeout(res, 2000, 4)),
                    new Date().toISOString()
                ]);
                next(action);
            },
            (store) => (next) => (action) => {
                action.push([3, new Date().toISOString()]);
                next(action);
            }
        ];
        const store = createStoreForMiddlewareTest(middlewares);
        const action = [];
        store.dispatch(action);
        await new Promise(res => setTimeout(res, 2000));
    })

    it('async non-blocking scenario', async () => {
        const middlewares = [
            (store) => (next) => (action) => {
                next(action);
                action.push([1, new Date().toISOString()]);
            },
            (store) => (next) => async (action) => {
                next(action);
                action.push([2, new Date().toISOString()]);
                action.push([
                    await new Promise(res => setTimeout(res, 2000, 4)),
                    new Date().toISOString()
                ]);
            },
            (store) => (next) => (action) => {
                next(action);
                action.push([3, new Date().toISOString()]);
            }
        ];
        const store = createStoreForMiddlewareTest(middlewares);
        const action = [];
        store.dispatch(action);
        await new Promise(res => setTimeout(res, 2000));
        const actual = action.map(x => x[0]);
        expect(actual).toEqual([3, 2, 1, 4]);
    })

    it('test', () => {
        function A(next) {
            return function A1(action) {
                action.push(1);
                next(action)
            }
        }
        function B(next) {
            return function B1(action) {
                action.push(2);
                next(action)
            }
        }
        function C(next) {
            return function C1(action) {
                action.push(3);
                next(action)
            }
        }
        const store = {
            dispatch: (action) => {}
        }

        const action = [];
        const dispatch = (function A1(action) {
            action.push(1);
            (function B1(action) {
                action.push(2);
                return(function C1(action) {
                    action.push(3);
                    store.dispatch(action)
                })(action);
            })(action)
        });

        A(B(C(store.dispatch)))(action);
        const actual = action;
        expect(actual).toEqual([1, 2, 3]);
    });

    it.skip('stack', () => {

        const action = [];
        const store = {
            dispatch: (action) => {}
        }
        const dispatch = (function middlewareA(action) {
                action.push('[middlewareA] stack is open');
                action.push('[middlewareA] before call next');
                (function middlewareB(action) {
                    action.push('[middlewareB] stack is open');
                    action.push('[middlewareB] before call next');
                    action.push('[middlewareB] after call next');
                    store.dispatch(action);
                })(action)
                action.push('[middlewareA] after call next');
        });
        dispatch(action);
        console.log(action);
    });
})
