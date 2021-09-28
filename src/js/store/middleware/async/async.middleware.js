const { AsyncActionCommand } = require('../../entity');
const { CCH_DB_SEED, CCH_DB_FETCH, CCH_DB_CREATE, CCH_DB_DELETE, ASY_DOCS_TODOITEMS, ASY_CREATE_RESOLVED, ASY_DELETE_RESOLVED, ASY_SEED_RESOLVED } = require('../../vo');

const AsyncMiddleware = (dispatch) => (store) => (next) => async(action) => {
  next(action);
  let res;
  if (action.constructor !== AsyncActionCommand) {
    return;
  }
  dispatch ? (store.dispatch = dispatch) : null;

  switch(action) {
    case CCH_DB_SEED:
      await action.promise
      store.dispatch(ASY_SEED_RESOLVED);
      return;
    case CCH_DB_CREATE:
      await action.promise
      store.dispatch(ASY_CREATE_RESOLVED);
      return;
    case CCH_DB_DELETE:
      await action.promise
      store.dispatch(ASY_DELETE_RESOLVED);
      return;
    case CCH_DB_FETCH:
      res = await action.promise
      ASY_DOCS_TODOITEMS.document = res;
      store.dispatch(ASY_DOCS_TODOITEMS);
      return;
  }
};

module.exports = {
  AsyncMiddleware
};
