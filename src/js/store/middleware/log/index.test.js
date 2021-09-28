const logMiddleware = require('./index');
const { createStoreForMiddlewareTest } = require('#tests/middleware');

describe('Middleware Module: log', () => {
    let { ActionEvent, ActionDocument, ActionCommand } = require('../../entity');

    it.skip('log handle ActionEvent', () => {
        let sender = 'aa',
            subject = 'bb',
            message = 'cc';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionEvent(sender, subject, message);
        store.dispatch(expected);
    })

    it.skip('log handle ActionEvent', () => {
        let sender = 'aa',
            subject = 'bb',
            doctype = 'cc';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionDocument(sender, subject, doctype);
        store.dispatch(expected);
    })

    it.skip('log handle ActionEvent', () => {
        let sender = 'aa',
            subject = 'bb',
            command = 'cc';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionCommand(sender, subject, command);
        store.dispatch(expected);
    })
})