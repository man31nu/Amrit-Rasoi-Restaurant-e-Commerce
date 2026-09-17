const { AsyncLocalStorage } = require('async_hooks');
const { v4: uuidv4 } = require('uuid');
const { traceIdHeader } = require('./log-constants');

const asyncLocalStorage = new AsyncLocalStorage();

const loggerContext = (req, _res, next) => {
  const header = req.headers[traceIdHeader];
  let traceId = Array.isArray(header) ? header[0] : header;
  if (!traceId) {
    traceId = uuidv4();
  }
  asyncLocalStorage.run(traceId, () => {
    req.headers[traceIdHeader] = traceId;
    next();
  });
};

module.exports = {
  asyncLocalStorage,
  loggerContext,
};
