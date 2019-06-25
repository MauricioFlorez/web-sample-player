const alexa = require('./alexa');
const ui = require('./ui');
const logger = require('./util/logger');
const mediaPlayer = require('./mediaPlayer');

function init() {
  logger.setLogLevel(logger.LogLevels.INFO);
  alexa.init();
  ui.init();
  mediaPlayer.init();
}

init();
