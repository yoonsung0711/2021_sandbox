const { ActionEvent, ActionCommand, ActionDocument } = require('../../entity');
const { MOD_OUTPUT_LOADED, MOD_TODO_CREATE, MOD_TODO_DELETE, APP_CACHE_FETCH, APP_CACHE_CREATE, APP_CACHE_DELETE } = require('../../vo');

const AppMiddleware = (dispatch) => (store) => (next) => (action) => {
   next(action);
   dispatch ? store.dispatch = dispatch : null;
   if (action.constructor === ActionEvent) {
       switch(action) {
           case MOD_OUTPUT_LOADED:
            store.dispatch(APP_CACHE_FETCH);
            break;
       }
   }

   if (action.constructor === ActionCommand) {
    //    store.dispatch(action);
       return;
   }

   if (action.constructor === ActionDocument) {
    //    store.dispatch(action);
       switch(action) {
           case MOD_TODO_CREATE:
            APP_CACHE_CREATE.arguments = action.document;
            store.dispatch(APP_CACHE_CREATE);
            break;
           case MOD_TODO_DELETE:
            APP_CACHE_DELETE.arguments = action.document;
            store.dispatch(APP_CACHE_DELETE);
            break;
       }
       return;
   }
}

module.exports = {
    AppMiddleware,
}