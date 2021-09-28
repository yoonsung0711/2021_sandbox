describe('Thinking Experiment: Middleware', () => {
    let action1;

    it('process order of parametrized middlewares is from left to right', () => {
        const compose = (...funcs) => {
            return funcs
                .reduce((a, b) => (...args) => a(b(...args)));
        };
        const middlewareA = (store) => (next) => (action) => {
            // region 2
            action.push('[middlewareA] stack is open');
            action.push('[middlewareA] before call next');
            next(action);
            // region 3
            action.push('[middlewareA] after call next');
        };
        const middlewareB = (store) => (next) => (action) => {
            // region 2
            action.push('[middlewareB] stack is open');
            action.push('[middlewareB] before call next');
            next(action);
            // region 3
            action.push('[middlewareB] after call next');
        };

        const stubStore = { dispatch: () => {} };
        const chain = [middlewareA, middlewareB].map((middleware) => middleware(stubStore));
        const dispatch = compose(...chain)(stubStore.dispatch);

        action1 = [];
        dispatch(action1);


        const composedMiddleware2 = (...args) => middlewareA(stubStore)(middlewareB(stubStore)(...args));
        const dispatch2 = composedMiddleware2(stubStore.dispatch);

        const action2 = [];
        dispatch2(action2);


        const middlewareAA = middlewareA(stubStore);
        const middlewareBB = middlewareB(stubStore);
        const composedMiddleware3 = (...args) => middlewareAA(middlewareBB(...args));
        const dispatch3 = composedMiddleware3(stubStore.dispatch);

        const action3 = [];
        dispatch3(action3);
        expect(action1).toEqual(action2);
        expect(action2).toEqual(action3);
        expect(action3).toEqual(action1);
    });

    it('simulate process order of composed middleware', () => {
        const action4 = [];
        const dispatch = (action) => {
            action.push('[middlewareA] stack is open');
            action.push('[middlewareA] before call next');
            ((action) => {
                action.push('[middlewareB] stack is open');
                action.push('[middlewareB] before call next');
                action.push('[middlewareB] after call next');
            })(action);
            action.push('[middlewareA] after call next');
        };
        dispatch(action4);
        expect(action1).toEqual(action4);
    })
});