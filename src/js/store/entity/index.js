class ActionCommand {
    sender;
    subject;
    command;
    arguments;
    constructor(sender, subject, command) {
        this.sender = sender;
        this.subject = subject;
        this.command = command;
    }
}

class AsyncActionCommand extends ActionCommand{
    promise;
    constructor(sender, subject, command) {
        super(sender, subject, command);
    }
}

class ActionEvent {
    sender;
    subject;
    message;
    constructor(sender, subject, message) {
        this.sender = sender;
        this.subject = subject;
        this.message = message;
    }
}

class ActionDocument {
    sender;
    subject;
    doctype;
    document;
    constructor(sender, subject, doctype) {
        this.sender = sender;
        this.subject = subject;
        this.doctype = doctype;
    }
}

module.exports = {
    ActionCommand,
    ActionEvent,
    ActionDocument,
    AsyncActionCommand,
}