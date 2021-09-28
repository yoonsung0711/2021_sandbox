const { LOG } = require('./util');
const { APP_CACHE_SEED, APP_CACHE_SYNC } = require('./store/vo');

module.exports = (doc, input, output, store) => new (class {
    input;
    output;
    store;
    constructor() {
        store.dispatch(APP_CACHE_SEED);
        store.dispatch(APP_CACHE_SYNC);
        this.input = input(doc, store);
        this.output = output(doc, store);
        this.store = store;
    }
})
