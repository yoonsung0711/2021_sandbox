describe('Store Module: bindAction', () => {
    let createStore;
    let reducer;
    let store;
    let bindAction;
    let bound;
    let createItemTodoAction;

    beforeEach(() => {
        createStore = require('./createStore');
        reducer = (state, action) => {
            switch(action.type) {
                case 'BIND_ACTION_TEST':
                    return ({ ...state, ...action.payload })
            }
        };
        bindAction = require('./bindAction');
        store = createStore(reducer);
        createItemTodoAction = (item) => {
            return ({ type: 'BIND_ACTION_TEST', payload: { todoItems: item } });
        };
        bound = bindAction({ createItemTodo: createItemTodoAction }, store.dispatch);
    })

    it('bound action has same effect with manual dispatch', () => {
        const expected = [
            { date: '2021-01-01', name: 'test_for_bind_action1' },
            { date: '2021-02-01', name: 'test_for_bind_action2' }
        ];
        store.subscribe(() => { const state = store.getState(); actual = state.todoItems } );

        store.dispatch(createItemTodoAction(expected[0]));
        expect(actual).toEqual(expected[0]);

        const { createItemTodo } = bound;
        createItemTodo(expected[1]);
        expect(actual).toEqual(expected[1]);
    })
})