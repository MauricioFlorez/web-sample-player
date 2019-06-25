const mediaPlayer = require('./mediaPlayer');
const logger = require('./util/logger');

const self = {};
let ui;

/**
 * Handle load content command
 */
function loadContentHandler(playbackParams) {
  function loadContent(resolve, reject) {
    try {
      const content = JSON.parse(playbackParams.contentUri);
      mediaPlayer.load(playbackParams);
      ui.setVideoTitle(content.title);
      resolve();
    } catch (err) {
      reject(err);
    }
  }

  return new Promise(loadContent);
}

/**
  * Handle pause video command
  */
function pauseHandler() {
  function pause(resolve, reject) {
    try {
      mediaPlayer.pause();
      resolve();
    } catch (err) {
      reject(err);
    }
  }

  return new Promise(pause);
}

/**
 * Handle resume video command
 */
function resumeHandler() {
  function resume(resolve, reject) {
    try {
      mediaPlayer.resume();
      resolve();
    } catch (err) {
      reject(err);
    }
  }

  return new Promise(resume);
}

/**
 * Handle play next video command
 */
function nextHandler() {
  function next(resolve, reject) {
    reject({
      errorType: self.AlexaWebPlayerController.ErrorType.CONTENT_NOT_AVAILABLE,
      message: '"Next" operation has not been implemented.',
    });
  }

  return new Promise(next);
}

/**
 * Handle play previous video command
 */
function previousHandler() {
  function previous(resolve, reject) {
    reject({
      errorType: self.AlexaWebPlayerController.ErrorType.CONTENT_NOT_AVAILABLE,
      message: '"Previous" operation has not been implemented.',
    });
  }

  return new Promise(previous);
}


/**
 * Handle seekToAbsolute command
 */
function setSeekPositionHandler(offsetInMilliseconds) {
  function setSeekPosition(resolve, reject) {
    try {
      mediaPlayer.setPosition(offsetInMilliseconds / 1000);
      resolve();
    } catch (err) {
      reject({
        errorType: window.AlexaWebPlayerController.ErrorType.PLAYER_ERROR,
        message: err.getMessage(),
      });
    }
  }


  return new Promise(setSeekPosition);
}


/**
 * Handle adjustSeekPosition command
 */
function adjustSeekPositionHandler(offsetInMilliseconds) {
  function adjustSeekPosition(resolve, reject) {
    try {
      mediaPlayer.adjustPosition(offsetInMilliseconds / 1000);
      resolve();
    } catch (err) {
      reject({
        errorType: window.AlexaWebPlayerController.ErrorType.PLAYER_ERROR,
        message: err.getMessage(),
      });
    }
  }

  return new Promise(adjustSeekPosition);
}


/**
 * Handle closedCaptionsStateChange command
 */
function closedCaptionsStateChangeHandler(state) {
  function closedCaptionsStateChange(resolve) {
    // @TODO: not currently implemented
    logger.debug(`CC not currently implemented (state = ${JSON.stringify(state)})`);

    resolve();
  }
  return new Promise(closedCaptionsStateChange);
}

/**
 * Handle prepareForClose command
 */
function prepareForCloseHandler() {
  function prepareForClose(resolve) {
    // Add additional analytics or closure logic here
    // ...
    logger.info('alexa::prepareForClose - Preparation complete');

    resolve();
  }
  return new Promise(prepareForClose);
}

function installHandlers() {
  const eventNames = self.AlexaWebPlayerController.Event;

  self.alexaInterface.on({
    [eventNames.LOAD_CONTENT]: loadContentHandler,
    [eventNames.PAUSE]: pauseHandler,
    [eventNames.RESUME]: resumeHandler,
    [eventNames.NEXT]: nextHandler,
    [eventNames.PREVIOUS]: previousHandler,
    [eventNames.SET_SEEK_POSITION]: setSeekPositionHandler,
    [eventNames.ADJUST_SEEK_POSITION]: adjustSeekPositionHandler,
    [eventNames.CLOSED_CAPTIONS_STATE_CHANGE]: closedCaptionsStateChangeHandler,
    [eventNames.PREPARE_FOR_CLOSE]: prepareForCloseHandler,
  });
}

/**
 *
 */
function initAlexa() {
  /**
   *
   */
  function handleReady(alexaInterface) {
    self.alexaInterface = alexaInterface;

    // Register command handlers
    installHandlers();

    // Set player state to IDLE
    self.alexaInterface.setPlayerState({
      state: self.AlexaWebPlayerController.State.IDLE,
      positionInMilliseconds: 0,
    });

    logger.debug('alexa::handleReady - Player is ready for loadContent');
  }

  function handleFailure() {
    logger.debug('alexa::handleFailure');
  }

  if (typeof window.AlexaWebPlayerController !== 'object') {
    throw new Error('AlexaWebPlayerController not found, unable to continue.');
  }

  logger.debug('alexa::initAlexa - AlexaWebPlayerController is available, initializing');

  // Save local reference to controller
  self.AlexaWebPlayerController = window.AlexaWebPlayerController;
  self.AlexaWebPlayerController.initialize(handleReady, handleFailure);
}

function init() {
  ui = require('./ui'); // eslint-disable-line global-require
  initAlexa();
}

function setPlayerState(state) {
  if (self.alexaInterface) {
    self.alexaInterface.setPlayerState(state);
  }
}

function showLoadingOverlay(isVisible) {
  if (self.alexaInterface) {
    self.alexaInterface.showLoadingOverlay(isVisible);
  }
}

function setMetadata(metadata) {
  if (self.alexaInterface) {
    self.alexaInterface.setMetadata(metadata);
  }
}

function close() {
  if (self.alexaInterface) {
    self.alexaInterface.close();
  }
}

function sendError(error) {
  if (self.alexaInterface) {
    self.alexaInterface.sendError(error);
  }
}

function setAllowedOperations(operations) {
  if (self.alexaInterface) {
    self.alexaInterface.setAllowedOperations(operations);
  }
}

function getClosedCaptionsState() {
  if (self.alexaInterface) {
    return self.alexaInterface.getClosedCaptionsState();
  }
  return null;
}

function setClosedCaptionsState(state) {
  if (self.alexaInterface) {
    self.alexaInterface.setClosedCaptionsState(state);
  }
}

module.exports = {
  init,
  setPlayerState,
  setMetadata,
  showLoadingOverlay,
  close,
  sendError,
  setAllowedOperations,
  getClosedCaptionsState,
  setClosedCaptionsState,
};
