module.exports = (reducer) => {
  let state;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((callback) => {
      callback();
    });
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  return ({
    getState,
    subscribe,
    dispatch,
    state,
    listeners,
  });
};

// module.exports = (uid) => (initItems) => new (class {
//     items
//     state = { items: [] }
//     constructor() {
//         this.state.items = [...initItems]
//             .map(item => ({
//                 id: uid(),
//                 ...item
//             }))
//     }
//     getState() {
//         return this.state
//     }
//     dispatch({ type, payload }) {
//         switch(type) {
//             case 'create':
//                 const item = ({
//                     id: uid(),
//                     ...payload
//                 })
//                 LOG(`[str] create item ${item.id}`)
//                 this.state.items = [...this.state.items, item]
//                 break
//             case 'delete':
//                 LOG(`[str] delete item ${payload}`)
//                 this.state.items = [...this.state.items].filter(item => item.id !== payload)
//                 break
//         }
//     }
//     subscribe(listener) {

//     }
// })
