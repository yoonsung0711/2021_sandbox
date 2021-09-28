let applyMiddleware = require('../../src/js/store/_lib/applyMiddleware');
let createStore = require('../../src/js/store/_lib/createStore');
let reducer = require('../../src/js/store/reducer');

const createStoreForMiddlewareTest = (middlewares) => applyMiddleware(...middlewares)(createStore)(reducer);

module.exports = {
    createStoreForMiddlewareTest,
}