const { SENDER_TYPE, SUBJECT_TYPE, MESSAGE_TYPE, COMMAND_TYPE, DOC_TYPE } = require('../../vo');
const { ActionEvent, ActionCommand, ActionDocument } = require('../../entity');
const { ActionLogger } =  require('./log.util');

describe('log Middleware: util', () => {
    it('create log for ActionEvent', () => {
        let actual;
        const actionLogger = ActionLogger({ logger: (msg) => { actual = msg } });
        const action = new ActionEvent(
            SENDER_TYPE.APPLICATION, 
            SUBJECT_TYPE.INPUT,
            MESSAGE_TYPE.LOADED,
        );
        actionLogger(action);
        expect(actual).toEqual("[APP] INPUT    |LOADED |");
    })

    it('create log for ActionCommand', () => {
        let actual;
        const actionLogger = ActionLogger({ logger: (msg) => { actual = msg } });
        const action = new ActionCommand(
            SENDER_TYPE.APPLICATION, 
            SUBJECT_TYPE.CACHE,
            COMMAND_TYPE.FETCH,
        );
        actionLogger(action);
        expect(actual).toEqual("[APP] CACHE    |FETCH  |");
    })

    it('create log for ActionDocument', () => {
        let actual;
        const actionLogger = ActionLogger({ logger: (msg) => { actual = msg } });
        const action = new ActionDocument(
            SENDER_TYPE.CACHE, 
            SUBJECT_TYPE.DOCS,
            DOC_TYPE.TODO_ITEMS,
        );
        actionLogger(action);
        expect(actual).toEqual("[CCH] DOCS     |TODOS  |");
    })
})