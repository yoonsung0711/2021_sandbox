const { APP_CACHE_SEED, APP_CACHE_SYNC } = require('./store/vo');
const { logCreator: _ } = require('./store/middleware/log/log.util');

describe('mediator', () => {
    const mediator = require('./mediator');

    it(`it firstly  dispatches ${_(APP_CACHE_SEED)} on load`, () => {
        let actual = [];
        mediator({}, () => {}, () => {}, { dispatch : (action) => { actual.push(action) } });
        expect(actual[0]).toEqual(APP_CACHE_SEED);
    })

    it(`it secondly dispatches ${_(APP_CACHE_SYNC)} on load`, () => {
        let actual = [];
        mediator({}, () => {}, () => {}, { dispatch : (action) => { actual.push(action) } });
        expect(actual[1]).toEqual(APP_CACHE_SYNC);
    })
})