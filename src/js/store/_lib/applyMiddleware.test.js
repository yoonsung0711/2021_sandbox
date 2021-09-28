const LOG = (msg) => {
    process.env.DEBUG ? console.log(msg) : null
};

describe('Store Module: applyMiddleware', () => {
    let applyMiddleware;
    let createStore;
    let stub_middlewares;
    let reducer;

    beforeEach(() => {
        applyMiddleware = require('./applyMiddleware');
        createStore = require('./createStore');
        reducer = (state, action) => {
            switch (action.type) {
                case 'REDUCER_TEST':
                    console.log('reducer!!!')
                    break
            }
        };
        stub_middlewares = [(store) => (next) => (action) => {
                let result = next(action);
                switch (action.type) {
                    case 'MIDDLEWARE_TEST':
                        console.log('middleware!!!');
                        break;
                }
                return result;
            }
        ];
    })

    it('middleware accepts store as the first currying argument', () => {
        function stub_middleware(spyOnMiddleware) {
            return store => {
                spyOnMiddleware(store);
                return next => action => next(action);
            }
        };

        const spy = jest.fn();
        const store = applyMiddleware(stub_middleware(spy))(createStore)(reducer);

        store.dispatch({type: 'ABC'});

        expect(spy.mock.calls[0][0]).toHaveProperty('getState');
        expect(spy.mock.calls[0][0]).toHaveProperty('dispatch');
    })

    it('middleware chain deliver dispatched & processed value to next middleware', () => {
        function stub_middleware1(spyOnDispatcher) {
            return() => next => action => {
                spyOnDispatcher(action);
                return next(action);
            }
        }
        function stub_middleware2(spyOnDispatcher) {
            return() => next => action => {
                spyOnDispatcher(action);
                return next(action);
            };
        }
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const store = applyMiddleware(stub_middleware1(spy1), stub_middleware2(spy2))(createStore)(reducer);

        const expected = {
            type: 'DEF'
        };
        const dispatchedValue1 = store.dispatch(expected);
        expect(dispatchedValue1).toEqual(expected);
        expect(spy2.mock.calls[0][0]).toEqual(dispatchedValue1);
    })

    it('log middleware handle all actions', () => {
        let logs = [];

        const logMiddleware = (store) => (next) => (action) => {
            logs.push(action)
            return next(action)
        };
        const asyncMiddleware = (store) => (next) => (action) => {
            return next(action);
        };
        const store = applyMiddleware(logMiddleware, asyncMiddleware)(createStore)(reducer);
        const expected = [
            {
                type: 'testing logMiddleware1'
            }, {
                type: 'testing logMiddleware2'
            }
        ];
        expected.forEach(store.dispatch);
        expect(logs).toEqual(expected);
    })

    it('async middleware handle action with promised payload', async () => {
        let actual;
        const logMiddleware = (store) => (next) => (action) => {
            return next(action)
        };
        const asyncMiddleware = ({ dispatch }) => (next) => (action) => {
            if (!action.payload || !action.payload.then) {
                return next(action);
            }

            action.payload.then(response => {
                actual = response;
                const newAction = {
                    ...action,
                    payload: response
                };
                dispatch(newAction);
            })
            return next(action);
        }
        const store = applyMiddleware(logMiddleware, asyncMiddleware)(createStore)(reducer);
        const expected = 'this will be resolved';
        store.dispatch({
            type: 'async request',
            payload: new Promise(resolve => {
                resolve(expected)
            })
        });
        await(new Promise(res => setTimeout(res, 0)));
        expect(actual).toEqual(expected);
    })
})
