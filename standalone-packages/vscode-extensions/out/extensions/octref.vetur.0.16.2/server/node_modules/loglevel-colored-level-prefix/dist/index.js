'use strict';

var loglevel = require('loglevel');
var chalk = require('chalk');

var loggers = {};

module.exports = getLogger;

function getLogger() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$level = _ref.level,
      level = _ref$level === undefined ? getDefaultLevel() : _ref$level,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === undefined ? '' : _ref$prefix;

  if (loggers[prefix]) {
    return loggers[prefix];
  }
  var coloredPrefix = prefix ? `${chalk.dim(prefix)} ` : '';
  var levelPrefix = {
    TRACE: chalk.dim('[TRACE]'),
    DEBUG: chalk.cyan('[DEBUG]'),
    INFO: chalk.blue('[INFO]'),
    WARN: chalk.yellow('[WARN]'),
    ERROR: chalk.red('[ERROR]')
  };

  var logger = loglevel.getLogger(`${prefix}-logger`);

  // this is the plugin "api"
  var originalFactory = logger.methodFactory;
  logger.methodFactory = methodFactory;

  var originalSetLevel = logger.setLevel;
  logger.setLevel = setLevel;
  logger.setLevel(level);
  loggers[prefix] = logger;
  return logger;

  function methodFactory() {
    for (var _len = arguments.length, factoryArgs = Array(_len), _key = 0; _key < _len; _key++) {
      factoryArgs[_key] = arguments[_key];
    }

    var logLevel = factoryArgs[0];

    var rawMethod = originalFactory.apply(undefined, factoryArgs);
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return rawMethod.apply(undefined, [`${coloredPrefix}${levelPrefix[logLevel.toUpperCase()]}:`].concat(args));
    };
  }

  function setLevel(levelToSetTo) {
    var persist = false; // uses browser localStorage
    return originalSetLevel.call(logger, levelToSetTo, persist);
  }
}

function getDefaultLevel() {
  var logLevel = process.env.LOG_LEVEL;

  if (logLevel === 'undefined' || !logLevel) {
    return 'warn';
  }
  return logLevel;
}