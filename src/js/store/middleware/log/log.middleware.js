const LogMiddleware = ({ actionLogger }) => {
    return (store) => (next) => (action) => {
        next(action);
        actionLogger(action);
    }
}

module.exports = {
    LogMiddleware
}