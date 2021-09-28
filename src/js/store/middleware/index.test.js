/* eslint-disable global-require */
// eslint-disable-next-line no-undef
describe('Store Module: middlewares', () => {
    let store;
    let createStoreForTest = require('#tests/middleware');

    beforeEach(() => {
        middlewares = require('./index').middlewares;
        store = createStoreForTest(middlewares);
    })

    it.skip('logMiddleware catch every dispatches', () => {
        spyFn = jest.fn();
        middlewares = [require('./index').logMiddleware(spyFn)];
        // const store = applyMiddleware(... middlewares)(createStore)(reducer);
        store = createStoreForTest(middlewares);
        store.dispatch({type: 'TEST1'});
        store.dispatch({type: 'TEST2'});
        store.dispatch({type: 'TEST3'});
        expect(spyFn).toHaveBeenCalledTimes(3);
    })

    it.skip('cacheMiddleware catch any dispatch tagged as CACHE request', async() => {
        spyFn = jest.fn();
        // middlewares = [require('./index').cacheMiddleware(spyFn)]
        // const store = applyMiddleware(... middlewares)(createStore)(reducer);
        store.dispatch({
            type: 'CACHE request',
            payload: new Promise(res => {
                res('success')
            })
        });
        await (new Promise(res => setTimeout(res, 0)));
        await (new Promise(res => setTimeout(res, 0)));
        await (new Promise(res => setTimeout(res, 0)));
        // store.dispatch({type: 'TEST2'});
        // store.dispatch({type: 'TEST3'});
        expect(spyFn).toHaveBeenCalledTimes(1);
    })

    it.skip('asyncMiddleware catch dispatch containing promised payload', () => {
        spyFn = jest.fn();
        // middlewares = [require('./index').asyncMiddleware(spyFn)];
        // const store = applyMiddleware(... middlewares)(createStore)(reducer);
        store.dispatch({
            type: 'HTTP request',
            payload: new Promise(res => {
                res('success')
            })
        });
        store.dispatch({type: 'TEST2'});
        store.dispatch({type: 'TEST3'});
        expect(spyFn).toHaveBeenCalledTimes(1);
    })
})