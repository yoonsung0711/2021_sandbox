
describe('Store Module: createStore', () => {
    let createStore;
    let mock_reducers;

    beforeEach(() => {
        createStore = require('./createStore');
        mock_reducers = { stubReducer: (state, action) => { } };
        spyOn(console, 'error');
    });

    it('should create a store with state prop', () => {
        store = createStore();
        expect(store.state).toBeUndefined();
    });

    it('should create a store with listeners prop', () => {
        store = createStore();
        expect(store.listeners).toBeDefined();
    });

    it('should create a store with getState method', () => {
        store = createStore();
        expect(store.getState).toBeDefined();
    });

    it('should create a store with dispatch method', () => {
        store = createStore();
        expect(store.dispatch).toBeDefined();
    });

    it('should create a store with subscribe method', () => {
        store = createStore();
        expect(store.subscribe).toBeDefined();
    });

    it('should invoke parameterized reducer on dispatching action', () => {
        const spyFn = spyOn(mock_reducers, 'stubReducer');
        store = createStore(mock_reducers['stubReducer']);
        store.dispatch({type: 'REDUCER_TEST', payload: 'TEST_DATA'});
        expect(spyFn).toHaveBeenCalledTimes(1);
    });

    it('should invoke reducer with action parameter on dispatching action', () => {
        const spyFn = spyOn(mock_reducers, 'stubReducer');
        store = createStore(mock_reducers['stubReducer']);
        const expected = { type: 'REDUCER_TEST', payload: 'TEST_DATA' };
        store.dispatch(expected);
        expect(spyFn).toHaveBeenCalledWith(undefined, expected);
    });

    it('should invoke reducer with action parameter on dispatching action', () => {
        const spyFn = spyOn(mock_reducers, 'stubReducer');
        store = createStore(mock_reducers['stubReducer']);
        const expected = { type: 'REDUCER_TEST', payload: 'TEST_DATA' };
        store.dispatch(expected);
        expect(spyFn).toHaveBeenCalledWith(undefined, expected);
    });

    it('should notify listeners on change of state ', () => {
        store = createStore(mock_reducers['stubReducer']);
        const spyFn = jest.fn();
        store.subscribe(spyFn);
        const expected = { type: 'REDUCER_TEST', payload: 'TEST_DATA' };
        store.dispatch(expected);
        expect(spyFn).toHaveBeenCalledTimes(1);
    });

    it('listeners can subscribe to catch the change of subject state ', () => {;
        mock_reducers = {
            todoItemReducer: (state, action) => {
                switch(action.type) {
                    case 'REDUCER_TEST':
                        return { ...state, ...action.payload }
                }
            }
        }
        store = createStore(mock_reducers['todoItemReducer'])
        const expected = { type: 'REDUCER_TEST', payload: { todoItems: ['TEST_DATA']} }
        let actual
        store.subscribe(() => { const state = store.getState(); actual = state } )
        store.dispatch(expected)
        expect(actual).toEqual(expected.payload)
    });

    it('listeners can unscribe the change of subject state ', () => {
        mock_reducers = {
            todoItemReducer: (state, action) => {
                switch(action.type) {
                    case 'REDUCER_TEST':
                        return { ...state, ...action.payload }
                }
            }
        }
        store = createStore(mock_reducers['todoItemReducer'])
        const expected = { type: 'REDUCER_TEST', payload: { todoItems: ['TEST_DATA']} }
        let actual
        const unsubscribe = store.subscribe(() => { const state = store.getState(); actual = state } )
        store.dispatch(expected)
        expect(actual).toEqual(expected.payload)
        unsubscribe()
        actual = undefined
        store.dispatch(expected)
        expect(actual).toEqual(undefined)
    });
})
