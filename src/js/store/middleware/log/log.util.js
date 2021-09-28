const { ActionEvent, ActionCommand, ActionDocument, AsyncActionCommand } = require('../../entity');

const logFormatter = (num, str) => 
    (num > str.length) ? (str + ' '.repeat(num - str.length)): str;

const ValidatorLogOf = ({ sender, subject, message }) => 
    `[${sender}] ${logFormatter(8, subject)} |${logFormatter(7, message)}|`

const EventLogOf = ({ sender, subject, message }) => 
    `[${sender}] ${logFormatter(8, subject)} |${logFormatter(7, message)}|`

const CommandLogOf = ({ sender, subject, command }) => 
    `[${sender}] ${logFormatter(8, subject)} |${logFormatter(7, command)}|`

const DocumentLogOf = ({ sender, subject, doctype }) => 
    `[${sender}] ${logFormatter(8, subject)} |${logFormatter(7, doctype)}|`


const logCreator = (action) => {
    switch(action.constructor) {
        case AsyncActionCommand:
        case ActionCommand:
            return CommandLogOf(action);
        case ActionEvent:
            return EventLogOf(action);
        case ActionDocument:
            return DocumentLogOf(action);
    }
}

const ActionLogger = ({ logger }) => (action) => {
    logger(logCreator(action));
}

module.exports = {
    logCreator,
    ActionLogger,
    EventLogOf,
    ValidatorLogOf,
}