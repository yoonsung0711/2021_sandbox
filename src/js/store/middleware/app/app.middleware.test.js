const { MOD_OUTPUT_LOADED, MOD_TODO_CREATE, MOD_TODO_DELETE, APP_CACHE_FETCH, APP_CACHE_CREATE, APP_CACHE_DELETE } = require('../../vo');
const { logCreator: _ } = require('../log/log.util');

describe('Middleware: app', () => {
    const { createStoreForMiddlewareTest }  = require('#tests/middleware')
    const { AppMiddleware } = require('./app.middleware');

    it(`dispatches "${_(APP_CACHE_FETCH)}" on ActionEvent with    "${_(MOD_OUTPUT_LOADED)}"`, () => {
        let actual;
        const store = createStoreForMiddlewareTest([AppMiddleware((action) => { actual = action })]);
        store.dispatch(MOD_OUTPUT_LOADED);
        expect(actual).toEqual(APP_CACHE_FETCH);
    })

    it(`dispatches "${_(APP_CACHE_CREATE)}" on ActionDocument with "${_(MOD_TODO_CREATE)}"`, () => {
        let actual;
        const store = createStoreForMiddlewareTest([AppMiddleware((action) => { actual = action })]);
        store.dispatch(MOD_TODO_CREATE);
        expect(actual).toEqual(APP_CACHE_CREATE);
    })

    it(`dispatches "${_(APP_CACHE_DELETE)}" on ActionDocument with "${_(MOD_TODO_DELETE)}"`, () => {
        let actual;
        const store = createStoreForMiddlewareTest([AppMiddleware((action) => { actual = action })]);
        store.dispatch(MOD_TODO_DELETE);
        expect(actual).toEqual(APP_CACHE_DELETE);
    })
})