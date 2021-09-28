const { CacheMiddleware } = require('./cache.middleware')
const db = require('../../../cache-db')();
const cacheMiddleware = CacheMiddleware(db);

module.exports = cacheMiddleware;