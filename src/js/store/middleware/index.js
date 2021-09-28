const logMiddleware = require('./log');
const appMiddleware = require('./app');
const cacheMiddleware = require('./cache');
const asyncMiddleware = require('./async');

/* eslint-disable global-require */
const middlewares = [
  appMiddleware,
  cacheMiddleware,
  logMiddleware,
  asyncMiddleware,
];
/* eslint-enable global-require */

module.exports = {
  middlewares,
};
