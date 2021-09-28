const { ActionLogger } = require('./log.util');
const { LOG } = require('../../../util');
const actionLogger = ActionLogger({ logger: LOG }) 
const { LogMiddleware } = require('./log.middleware')
const logMiddleware = LogMiddleware({ actionLogger })

module.exports = logMiddleware;
