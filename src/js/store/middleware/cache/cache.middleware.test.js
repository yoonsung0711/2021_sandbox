const { APP_CACHE_SEED, APP_CACHE_SYNC, APP_CACHE_FETCH, APP_CACHE_CREATE, APP_CACHE_DELETE, CCH_DB_SYNC, CCH_DB_SEED, CCH_DB_FETCH, CCH_DB_CREATE, CCH_DB_DELETE } = require('../../vo');
const { logCreator: _ } = require('../log/log.util');
const { ActionDocument, ActionEvent } = require('../../entity');

describe('Middleware Module: cacheMiddleware', () => {
    const { createStoreForMiddlewareTest } = require('#tests/middleware');
    const { CacheMiddleware } = require('./cache.middleware')

    it(`does not catch any ActionEvent`, async () => {
        let actual;
        const middlewares = [CacheMiddleware((action) => actual = action)];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(new ActionEvent('', '', ''));
        expect(actual).toEqual(undefined);
    })

    it(`does not catch any ActionDocument`, async () => {
        let actual;
        const middlewares = [CacheMiddleware({ 
            promiseOf: (action) => { actual = action; }
        })];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(new ActionDocument('', '', ''));
        expect(actual).toEqual();
    })

    it(`dispatches '${_(CCH_DB_SEED)}' on ActionCommand '${_(APP_CACHE_SEED)}'`, () => {
        let actual;
        const middlewares = [CacheMiddleware({ seedItems: () => new Promise(res=>res) }, (action) => { actual = action } )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_SEED);
        expect(actual).toEqual(CCH_DB_SEED);
    })


    it(`dispatches '${_(CCH_DB_SYNC)}' on ActionCommand '${_(APP_CACHE_SYNC)}'`, () => {
        let actual;
        const middlewares = [CacheMiddleware({}, (action) => { actual = action } )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_SYNC);
        expect(actual).toEqual(CCH_DB_SYNC);
    })

    it(`dispatches '${_(CCH_DB_FETCH)}' on ActionCommand '${_(APP_CACHE_FETCH)}'`, () => {
        let actual;
        const middlewares = [CacheMiddleware({ readAllItems: () => new Promise(res=>res) }, (action) => { actual = action } )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_FETCH);
        expect(actual).toEqual(CCH_DB_FETCH);
    })

    it(`dispatches '${_(CCH_DB_CREATE)}' on ActionCommand '${_(APP_CACHE_CREATE)}'`, () => {
        let actual;
        const middlewares = [CacheMiddleware({ createItem: () => new Promise(res=>res) }, (action) => { actual = action } )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_CREATE);
        expect(actual).toEqual(CCH_DB_CREATE);
    })

    it(`dispatches '${_(CCH_DB_DELETE)}' on ActionCommand '${_(APP_CACHE_DELETE)}'`, () => {
        let actual;
        const middlewares = [CacheMiddleware({ deleteItem: () => new Promise(res=>res) }, (action) => { actual = action } )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_DELETE);
        expect(actual).toEqual(CCH_DB_DELETE);
    })

    it(`dispatches '${_(CCH_DB_SEED)}' with promise on AsyncActionCommand '${_(APP_CACHE_SEED)}'`, async() => {
        let actual;
        const expected = 'resolved message';
        const middlewares = [CacheMiddleware({ seedItems: () => new Promise(res=>res(expected)) }, (action) => { actual = action} )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_SEED);
        expect(await actual.promise).toEqual(expected);
    })

    it(`dispatches '${_(CCH_DB_FETCH)}' with promise on AsyncActionCommand '${_(APP_CACHE_FETCH)}'`, async() => {
        let actual;
        const expected = 'resolved message';
        const middlewares = [CacheMiddleware({ readAllItems: () => new Promise(res=>res(expected)) }, (action) => { actual = action} )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_FETCH);
        expect(await actual.promise).toEqual(expected);
    })

    it(`dispatches '${_(CCH_DB_CREATE)}' with promise on AsyncActionCommand '${_(APP_CACHE_CREATE)}'`, async() => {
        let actual;
        const expected = 'resolved message';
        const middlewares = [CacheMiddleware({ createItem: () => new Promise(res=>res(expected)) }, (action) => { actual = action} )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_CREATE);
        expect(await actual.promise).toEqual(expected);
    })

    it(`dispatches '${_(CCH_DB_DELETE)}' with promise on AsyncActionCommand '${_(APP_CACHE_DELETE)}'`, async() => {
        let actual;
        const expected = 'resolved message';
        const middlewares = [CacheMiddleware({ deleteItem: () => new Promise(res=>res(expected)) }, (action) => { actual = action} )];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch(APP_CACHE_DELETE);
        expect(await actual.promise).toEqual(expected);
    })
})