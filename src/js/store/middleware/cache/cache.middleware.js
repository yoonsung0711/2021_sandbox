const { ActionCommand } = require('../../entity');
const { APP_CACHE_SYNC, APP_CACHE_SEED, APP_CACHE_FETCH, APP_CACHE_CREATE, APP_CACHE_DELETE, CCH_DB_SEED, CCH_DB_FETCH, CCH_DB_CREATE, CCH_DB_DELETE, CCH_DB_SYNC } = require('../../vo');

const CacheMiddleware = (db, dispatch) => (store) => (next) => (action) => {
  next(action);
  if (action.constructor !== ActionCommand) {
    return ;
  }
  dispatch ? (store.dispatch = dispatch) : null;

  switch(action) {
    case APP_CACHE_SEED:
      CCH_DB_SEED.promise = db.seedItems([]);
      store.dispatch(CCH_DB_SEED);
      return;
    case APP_CACHE_SYNC:
      store.dispatch(CCH_DB_SYNC);
      return;
    case APP_CACHE_FETCH:
      CCH_DB_FETCH.promise = db.readAllItems();
      store.dispatch(CCH_DB_FETCH);
      return;
    case APP_CACHE_CREATE:
      CCH_DB_CREATE.promise = db.createItem(action.arguments);
      store.dispatch(CCH_DB_CREATE);
      return;
    case APP_CACHE_DELETE:
      CCH_DB_DELETE.promise = db.deleteItem(action.arguments);
      store.dispatch(CCH_DB_DELETE);
      return;
  }
};

module.exports = {
  CacheMiddleware
};