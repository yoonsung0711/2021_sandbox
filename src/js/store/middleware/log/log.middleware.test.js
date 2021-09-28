const { createStoreForMiddlewareTest }= require('#tests/middleware');
const { LogMiddleware } = require('./log.middleware');

describe('Middleware Module: log', () => {
    let { ActionEvent, ActionDocument, ActionCommand } = require('../../entity');

    it('log handle ActionEvent', () => {
        let actual;
        const logMiddleware = LogMiddleware({ actionLogger: (msg) => { actual = msg; } });
        let sender = '',
            subject = '',
            message = '';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionEvent(sender, subject, message);
        store.dispatch(expected);
        expect(actual).toEqual(expected);
    })

    it('log handle ActionDocument', () => {
        let actual;
        const logMiddleware = LogMiddleware({ actionLogger: (msg) => { actual = msg; } });
        let sender = '',
            subject = '',
            doctype = '';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionDocument(sender, subject, doctype);
        store.dispatch(expected);
        expect(actual).toEqual(expected);
    })

    it('log handle ActionCommand', () => {
        let actual;
        const logMiddleware = LogMiddleware({ actionLogger: (msg) => { actual = msg; } });
        let sender = '',
            subject = '',
            command = '';
        const store = createStoreForMiddlewareTest([logMiddleware]);
        const expected = new ActionCommand(sender, subject, command);
        store.dispatch(expected);
        expect(actual).toEqual(expected);
    })
})