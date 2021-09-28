const { CCH_DB_FETCH, CCH_DB_CREATE, CCH_DB_DELETE, ASY_DOCS_TODOITEMS, ASY_SEED_RESOLVED, ASY_CREATE_RESOLVED, ASY_DELETE_RESOLVED, CCH_DB_SEED } = require('../../vo');
const { logCreator: _ } = require('../log/log.util');

describe('Middleware: async', () => {
    const { createStoreForMiddlewareTest } = require('#tests/middleware');
    const { AsyncMiddleware } = require('./async.middleware');

    it(`dispatches '${_(ASY_CREATE_RESOLVED)}' on AsyncActionCommand '${_(CCH_DB_CREATE)}'`, async() => {
       let actual;
       const middlewares = [AsyncMiddleware((dispatch) => { actual = dispatch } )];
       const store = createStoreForMiddlewareTest(middlewares);
       store.dispatch(CCH_DB_CREATE);
       await new Promise(res => setTimeout(res, 10));

       const expected = ASY_CREATE_RESOLVED;
       expect(actual).toEqual(expected);
    })

    it(`dispatches '${_(ASY_DELETE_RESOLVED)}' on AsyncActionCommand '${_(CCH_DB_DELETE)}'`, async() => {
       let actual;
       const middlewares = [AsyncMiddleware((dispatch) => { actual = dispatch } )];
       const store = createStoreForMiddlewareTest(middlewares);
       store.dispatch(CCH_DB_DELETE);
       await new Promise(res => setTimeout(res, 10));

       const expected = ASY_DELETE_RESOLVED;
       expect(actual).toEqual(expected);
    })

    it(`dispatches '${_(ASY_SEED_RESOLVED)}' on AsyncActionCommand '${_(CCH_DB_SEED)}'`, async() => {
       let actual;
       const middlewares = [AsyncMiddleware((dispatch) => { actual = dispatch } )];
       const store = createStoreForMiddlewareTest(middlewares);
       store.dispatch(CCH_DB_SEED);
       await new Promise(res => setTimeout(res, 10));

       const expected = ASY_SEED_RESOLVED;
       expect(actual).toEqual(expected);
    })

    it(`dispatches '${_(ASY_DOCS_TODOITEMS)}' on AsyncActionCommand '${_(CCH_DB_FETCH)}'`, async() => {
       let actual;
       const middlewares = [AsyncMiddleware((dispatch) => { actual = dispatch } )];
       const store = createStoreForMiddlewareTest(middlewares);
       store.dispatch(CCH_DB_FETCH);
       await new Promise(res => setTimeout(res, 10));

       const expected = ASY_DOCS_TODOITEMS;
       expect(actual).toEqual(expected);
    })

    it(`dispatches '${_(ASY_DOCS_TODOITEMS)}' with resolved promise on AsyncActionCommand '${_(CCH_DB_FETCH)}'`, async() => {
       let actual;
       const middlewares = [AsyncMiddleware((dispatch) => { actual = dispatch })];
       CCH_DB_FETCH.promise = new Promise((res, rej) => setTimeout(res, 500, 'promised result'));
       const store = createStoreForMiddlewareTest(middlewares);
       store.dispatch(CCH_DB_FETCH);
       await new Promise(res => setTimeout(res, 1000));

       const expected = ASY_DOCS_TODOITEMS;
       expect(actual.document).toEqual(expected.document);
    })

})