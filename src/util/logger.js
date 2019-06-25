const LogLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  VERBOSE: 3,
  DEBUG: 4,
  SILLY: 5,
};
const LevelNames = {
  [LogLevels.ERROR]: 'ERROR',
  [LogLevels.WARN]: 'WARN',
  [LogLevels.INFO]: 'INFO',
  [LogLevels.VERBOSE]: 'VERBOSE',
  [LogLevels.DEBUG]: 'DEBUG',
  [LogLevels.SILLY]: 'SILLY',
};
const self = {
  logLevel: 0,
};

function getLogLevel() {
  return self.logLevel;
}

function setLogLevel(level) {
  self.logLevel = level;
}

function log(level, message) {
  if (level <= self.logLevel) {
    console.log(`${LevelNames[level]}: ${message}`); // eslint-disable-line no-console
  }
}

function error(message) { log(LogLevels.ERROR, message); }
function warn(message) { log(LogLevels.WARN, message); }
function info(message) { log(LogLevels.INFO, message); }
function verbose(message) { log(LogLevels.VERBOSE, message); }
function debug(message) { log(LogLevels.DEBUG, message); }
function silly(message) { log(LogLevels.SILLY, message); }

module.exports = {
  LogLevels,
  getLogLevel,
  setLogLevel,
  log,
  error,
  warn,
  info,
  verbose,
  debug,
  silly,
};
