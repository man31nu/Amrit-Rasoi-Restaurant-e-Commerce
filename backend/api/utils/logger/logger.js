const pino = require('pino');
const { asyncLocalStorage } = require('./logger-context');
const enable_logger = true;

const name = process.env.APP_ENV || 'prod_test';
const destination = pino.destination({ sync: false });

const pinoLog = pino(
  {
    name: 'amrit-rasoi-' + name,
    level: 'debug',
    enabled: true,
    formatters: {
      level(label) {
        return {
          severity: label.toUpperCase(),
        };
      },
    },
    mixin() {
      return { traceId: asyncLocalStorage.getStore() ?? 'no-context' };
    },
  },
  destination
);

function flushLogs() {
  if (typeof destination.flushSync === 'function') {
    destination.flushSync();
  }
}

const logger = (args, description, type) => {
  if (enable_logger) {
    try {
      if (args && args.stack) {
        args = args.stack ? args.stack.replace(/\n/g, ' ') : args;
      }
      if (typeof args === 'object') {
        const seen = new WeakSet();
        args = JSON.stringify(args, (_key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        });
      } else {
        args = String(args);
      }
      if (type === 'info') {
        pinoLog.info({ value: args }, description);
      } else if (type === 'warn') {
        pinoLog.warn({ value: args }, description);
      } else if (type === 'error') {
        pinoLog.error({ err: args, 'API Name': description }, description);
      }
    } catch (e) {
      pinoLog.error({ err: String(e), 'API Name': description }, 'logger serialization failed');
    }
  } else {
    if (type === 'error') {
      console.error('\n description, type, args =', description, type, args);
    } else {
      console.log('\n description, type, args =', description, type, args);
    }
  }
};

process.on('uncaughtException', (err) => {
  logger(err, 'UNCAUGHT EXCEPTION! Shutting down...', 'error');
  flushLogs();
});

module.exports = {
  logger,
  flushLogs,
  pinoLog,
};
