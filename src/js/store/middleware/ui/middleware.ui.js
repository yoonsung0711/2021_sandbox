const UiMiddleware = (output, dispatch) => (store) => (next) => (action) => {
    next(action);
}

module.exports = UiMiddleware;
