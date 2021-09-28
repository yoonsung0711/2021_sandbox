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


    it('unsafe recursive call in middlewares', () => {
        const middlewares = [
            (store) => (next) => (action) => {
                action.A_call_count = action.A_call_count + 1;
                next(action);
                if (action.val < 100) {
                    action.val = action.val + 1
                    dispatch(action);
                } else {
                    return
                }
            },
            (store) => (next) => (action) => {
                action.B_call_count = action.B_call_count + 1;
                next(action);
                if (action.val < 100) {
                    action.val = action.val + 1
                    dispatch(action);
                } else {
                    return
                }
            }
        ];
        const dispatch = compose(... middlewares.map((middleware) => middleware(stubStore)))(stubStore.dispatch);
        const action = {
            val: 0,
            A_call_count: 0,
            B_call_count: 0
        };
        dispatch(action);
        expect(action).toEqual({ val: 100, A_call_count: 101, B_call_count: 101 });
    })

    it('unsafe recursive call in middlewares', () => {
        const middlewares = [
            (store) => (next) => (action) => {
                action.A_call_count = action.A_call_count + 1;
                next(action);
                if (action.val < 100) {
                    action.val = action.val + 1
                    store.dispatch(action);
                } else {
                    return
                }
            },
            (store) => (next) => (action) => {
                action.B_call_count = action.B_call_count + 1;
                next(action);
                if (action.val < 100) {
                    action.val = action.val + 1
                    store.dispatch(action);
                } else {
                    return
                }
            }
        ];
        const store = createStoreForMiddlewareTest(middlewares);
        const action = {
            val: 0,
            A_call_count: 0,
            B_call_count: 0
        };
        store.dispatch(action);
        expect(action).toEqual({ val: 100, A_call_count: 101, B_call_count: 101 })
    })
})
