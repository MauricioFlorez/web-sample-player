'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/******/(function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 4);
  /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports) {
  var _LevelNames;

  var LogLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    VERBOSE: 3,
    DEBUG: 4,
    SILLY: 5
  };
  var LevelNames = (_LevelNames = {}, _defineProperty(_LevelNames, LogLevels.ERROR, 'ERROR'), _defineProperty(_LevelNames, LogLevels.WARN, 'WARN'), _defineProperty(_LevelNames, LogLevels.INFO, 'INFO'), _defineProperty(_LevelNames, LogLevels.VERBOSE, 'VERBOSE'), _defineProperty(_LevelNames, LogLevels.DEBUG, 'DEBUG'), _defineProperty(_LevelNames, LogLevels.SILLY, 'SILLY'), _LevelNames);
  var self = {
    logLevel: 0
  };

  function getLogLevel() {
    return self.logLevel;
  }

  function setLogLevel(level) {
    self.logLevel = level;
  }

  function log(level, message) {
    if (level <= self.logLevel) {
      console.log(LevelNames[level] + ': ' + message); // eslint-disable-line no-console
    }
  }

  function error(message) {
    log(LogLevels.ERROR, message);
  }
  function warn(message) {
    log(LogLevels.WARN, message);
  }
  function info(message) {
    log(LogLevels.INFO, message);
  }
  function verbose(message) {
    log(LogLevels.VERBOSE, message);
  }
  function debug(message) {
    log(LogLevels.DEBUG, message);
  }
  function silly(message) {
    log(LogLevels.SILLY, message);
  }

  module.exports = {
    LogLevels: LogLevels,
    getLogLevel: getLogLevel,
    setLogLevel: setLogLevel,
    log: log,
    error: error,
    warn: warn,
    info: info,
    verbose: verbose,
    debug: debug,
    silly: silly
  };

  /***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

  /* eslint-env jquery */
  var ui = __webpack_require__(2);
  var logger = __webpack_require__(0);

  var alexa = null;
  var self = {
    video: null
  };

  /**
   *
   */
  function onPause() {
    ui.onPause();
    alexa.setPlayerState({
      state: window.AlexaWebPlayerController.State.PAUSED,
      positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10)
    });
  }

  /**
   *
   */
  function onPlay() {
    ui.onPlay();
  }

  /**
   *
   */
  function onPlaying() {
    ui.onPlaying();
    alexa.setPlayerState({
      state: window.AlexaWebPlayerController.State.PLAYING,
      positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10)
    });
  }

  /**
   *
   */
  function onWaiting() {
    alexa.setPlayerState({
      state: window.AlexaWebPlayerController.State.BUFFERING,
      positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10)
    });
  }

  /**
   *
   */
  function onEnd() {
    ui.onEnd();
    alexa.setPlayerState({
      state: window.AlexaWebPlayerController.State.IDLE,
      positionInMilliseconds: parseInt(0, 10)
    });

    // Inform Alexa we are ready to close
    alexa.close();
  }

  /**
   *
   */
  function onTimeUpdate() {
    // Calculate the slider value
    var value = 100 / self.video.duration * self.video.currentTime;

    // Update the slider value
    ui.onProgress(value);
  }

  /**
   *
   */
  function onLoadedData() {
    logger.debug('mediaPlayer::onLoadedData - Hiding overlay');

    // @TODO refactor to delegate UI handling to another component

    // Data has loaded, so we can hide the loading
    alexa.showLoadingOverlay(false);

    // Unset LoadedData listener
    self.video.onloadeddata = null;
  }

  /**
   *
   */
  function onCanPlay() {
    logger.debug('mediaPlayer::onCanPlay');
    ui.onCanPlay();
  }

  /**
   *
   */
  function onError() {
    logger.debug('mediaPlayer::onerror (code: ' + self.video.error.code + '; message: ' + self.video.error.message);
  }

  /*
   * Command Handlers
   */

  /**
   *
   * @param {*} playbackParams
   */
  function load(playbackParams) {
    var video = self.video;
    var contentUri = playbackParams.contentUri,
        offsetInMilliseconds = playbackParams.offsetInMilliseconds,
        autoplay = playbackParams.autoplay;

    var source = document.createElement('source');

    var _JSON$parse = JSON.parse(contentUri),
        streamUrl = _JSON$parse.streamUrl,
        title = _JSON$parse.title;

    // Set the video content based on contentUri being a stream URL


    source.setAttribute('src', streamUrl);

    // Set type based on extension loosely found in URL
    if (contentUri.indexOf('.mp4') >= 0) {
      source.setAttribute('type', 'video/mp4');
    } else if (contentUri.indexOf('.m3u8') >= 0) {
      source.setAttribute('type', 'application/x-mpegURL');
    } else {
      logger.debug('Unhandled video type for url: ' + streamUrl);
      throw new Error({
        errorType: alexa.ErrorType.INVALID_CONTENT_URI
      });
    }

    video.innerHTML = '';
    video.appendChild(source);

    // Set metadata for current content in Alexa
    alexa.setMetadata({
      title: title
    });

    // Set allowed operations
    alexa.setAllowedOperations({
      adjustRelativeSeekPositionForward: true,
      adjustRelativeSeekPositionBackwards: true,
      setAbsoluteSeekPositionForward: true,
      setAbsoluteSeekPositionBackwards: true,
      next: false,
      previous: false
    });

    // If specified, set the offsetInMilliseconds
    if (offsetInMilliseconds > 0) {
      video.currentTime = offsetInMilliseconds / 1000;
    }

    // Start playing now if autoplay is true
    if (autoplay) {
      video.play();
    } else {
      video.load();
    }
  }

  /**
    *
    * @param {*} offsetInSeconds
    */
  function setPosition(offsetInSeconds) {
    var newTime = offsetInSeconds;

    // Check for out of bounds
    newTime = newTime < 0 ? 0 : newTime;

    // If out of bounds at the end, bring allow for 3 seconds of playback
    newTime = newTime > self.video.duration ? self.video.duration - 3 : newTime;

    self.video.currentTime = newTime;
  }

  /**
   * Adjust the playback position by the given offset in seconds
   * @param {*} offsetInSeconds
   */
  function adjustPosition(offsetInSeconds) {
    return setPosition(self.video.currentTime + offsetInSeconds);
  }

  function pause() {
    self.video.pause();
  }

  function resume() {
    self.video.play();
  }

  function init() {
    var player = $('#player');

    // Delay to avoid circular dependency
    alexa = __webpack_require__(3); // eslint-disable-line global-require

    self.video = player.get(0);

    self.video.onpause = onPause;
    self.video.onplay = onPlay;
    self.video.onplaying = onPlaying;
    self.video.onended = onEnd;
    self.video.onwaiting = onWaiting;
    self.video.ontimeupdate = onTimeUpdate;
    self.video.onloadeddata = onLoadedData;
    self.video.oncanplay = onCanPlay;
    self.video.onerror = onError;
  }

  module.exports = {
    init: init,
    load: load,
    pause: pause,
    resume: resume,
    setPosition: setPosition,
    adjustPosition: adjustPosition
  };

  /***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

  /* eslint-env jquery */
  var logger = __webpack_require__(0);

  var mediaPlayer = null;
  var self = {
    isSlidingSeekBar: false,
    isControlEnabled: true,
    elements: {},
    controlTimeout: null,
    config: {
      CONTROL_FADE_OUT_DELAY_MILLISECONDS: 3000,
      CONTROL_FADE_OUT_DURATION_MILLISECONDS: 350,
      SKIP_TIME_INTERVAL_SECONDS: 10
    }
  };

  /*
   * Utility and helper functions
   */
  function fadeOutControlOverlay() {
    // Reset control fade out delay if set
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }

    self.elements.controlOverlay.removeClass('fadeIn fadeOut normal').addClass('fadeOut');
    self.elements.controlContainer.removeClass('fadeIn fadeOut normal').addClass('fadeOut');

    setTimeout(function () {
      self.isControlEnabled = false;
    }, self.config.CONTROL_FADE_OUT_DURATION_MILLISECONDS);
  }

  function fadeInControlOverlay() {
    // Reset control fade out delay if set
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }

    // Cancel previous animation if applicable
    self.elements.controlOverlay.removeClass('fadeIn fadeOut  normal').addClass('fadeIn');
    self.elements.controlContainer.removeClass('fadeIn fadeOut normal').addClass('fadeIn');
    self.isControlEnabled = true;
  }

  /*
   * Event Handlers
   */

  function isNative() {
    // @TODO make this a bit smarter
    return navigator.userAgent.indexOf('Android') >= 0;
  }

  /**
   *
   */
  function onCanPlay() {
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
    logger.debug('ui::onCanPlay');
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);
  }

  /**
   *
   */
  function onPlay() {
    logger.debug('ui::onPlay');
    self.elements.playIcon.hide();
    self.elements.pauseIcon.show();
  }

  /**
   *
   */
  function onPlaying() {
    logger.debug('ui::onPlaying');
  }

  /**
   *
   */
  function onPause() {
    logger.debug('ui::onPause');
    self.elements.pauseIcon.hide();
    self.elements.playIcon.show();
  }

  /**
   *
   */
  function onEnd() {
    logger.debug('ui::onEnd');
    // @TODO handle video completion UI here
    logger.debug('@TODO handle video completion UI here');
  }

  /**
   *
   */
  function onProgress(value) {
    logger.silly('ui::onProgress(percent = ' + value);
    var currentValue = self.elements.seekBar.get(0).value;
    var percent = Number.isNaN(value) ? 0 : value;
    percent = percent < 0 ? 0 : percent;
    percent = percent > 100 ? 1000 : percent;

    // Update seek bar only if there is a change and we aren't currently sliding
    if (self.isSlidingSeekBar || parseInt(currentValue, 10) === parseInt(percent, 10)) {
      return;
    }
    self.elements.seekBar.get(0).value = percent;
  }

  function setVideoTitle(title) {
    self.elements.title.html(title);
  }

  function handleTogglePlayClick(event) {
    if (!self.isControlEnabled) {
      return;
    }
    var video = self.elements.video.get(0);
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
    if (video.paused) {
      video.play();

      // Once we start playing, fade out the control overlay
      fadeOutControlOverlay();
    } else {
      video.pause();

      // Reset control fade out delay
      if (self.controlTimeout) {
        clearTimeout(self.controlTimeout);
      }
      self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);
    }

    event.stopPropagation();
  }

  /*
   * Control Handlers
   */

  function handleSeekBackClick(event) {
    if (!self.isControlEnabled) {
      return;
    }
    var video = self.elements.video.get(0);
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
    video.currentTime -= self.config.SKIP_TIME_INTERVAL_SECONDS;

    // Reset control fade out delay
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);

    event.stopPropagation();
  }

  function handleSeekForwardClick(event) {
    if (!self.isControlEnabled) {
      return;
    }
    var video = self.elements.video.get(0);
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;

    video.currentTime += self.config.SKIP_TIME_INTERVAL_SECONDS;

    // Reset control fade out delay
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);

    event.stopPropagation();
  }

  function handleSeekBarChange() {
    if (!self.isControlEnabled) {
      return;
    }
    var video = self.elements.video.get(0);
    var value = self.elements.seekBar.val();

    // Update the video time
    mediaPlayer.setPosition(video.duration * (value / 100));
  }

  function handleSeekBarTouchStart(event) {
    if (!self.isControlEnabled) {
      return;
    }
    self.isSlidingSeekBar = true;

    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    event.stopPropagation();
  }

  function handleSeekBarTouchEnd(event) {
    if (!self.isControlEnabled) {
      return;
    }
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
    self.isSlidingSeekBar = false;

    // Reset control fade out delay
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);

    event.stopPropagation();
  }

  function handleControlOverlayTouchEnd() {
    if (self.elements.controlOverlay.hasClass('normal') || self.elements.controlOverlay.hasClass('fadeIn')) {
      fadeOutControlOverlay();
      return;
    }
    var delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;

    fadeInControlOverlay();

    // Reset control fade out delay
    if (self.controlTimeout) {
      clearTimeout(self.controlTimeout);
    }
    self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);
  }

  function installHandlers() {
    var elements = self.elements;


    if (isNative()) {
      elements.togglePlayButton.on('touchend', handleTogglePlayClick);
      elements.seekBackButton.on('touchend', handleSeekBackClick);
      elements.seekForwardButton.on('touchend', handleSeekForwardClick);
      elements.controlOverlay.on('touchend', handleControlOverlayTouchEnd);
      elements.controlContainer.on('touchend', handleControlOverlayTouchEnd);

      elements.seekBar.on('touchstart', handleSeekBarTouchStart);
      elements.seekBar.on('touchend', handleSeekBarTouchEnd);
    } else {
      elements.togglePlayButton.on('click', handleTogglePlayClick);
      elements.seekBackButton.on('click', handleSeekBackClick);
      elements.seekForwardButton.on('click', handleSeekForwardClick);
      elements.controlOverlay.on('click', handleControlOverlayTouchEnd);
      elements.controlContainer.on('click', handleControlOverlayTouchEnd);

      elements.seekBar.on('mousedown', handleSeekBarTouchStart);
      elements.seekBar.on('mouseup', handleSeekBarTouchEnd);
    }
    elements.seekBar.on('change', handleSeekBarChange);
  }

  /**
   *
   */
  function init() {
    var pageHeight = $(window).height();
    var pageWidth = $(window).width();
    // const pageWidth = $(window).height();
    var controlsContainer = $('#controlsContainer');
    var seekContainer = $('#seekContainer');
    var playerContainer = $('#playerContainer');
    var title = $('#title');

    // Delayed require to resolve circular dependency with webpack
    mediaPlayer = __webpack_require__(1); // eslint-disable-line global-require

    controlsContainer.css('top', parseInt(pageHeight / 2, 10) - parseInt(controlsContainer.height() / 2, 10));
    controlsContainer.show();

    seekContainer.css('top', parseInt(pageHeight * 0.8, 10));
    seekContainer.show();

    playerContainer.css('top', parseInt(pageHeight / 2, 10) - parseInt(controlsContainer.height() / 2, 10));

    title.css('top', parseInt(pageHeight * 0.05, 10));
    title.css('width', parseInt(pageWidth * 0.8, 10));
    title.css('left', parseInt(pageWidth * 0.1, 10));

    self.elements.togglePlayButton = $('#togglePlayButton');
    self.elements.seekBackButton = $('#seekBackButton');
    self.elements.seekForwardButton = $('#seekForwardButton');
    self.elements.pauseIcon = $('#pauseIcon');
    self.elements.playIcon = $('#playIcon');
    self.elements.seekBar = $('#seekBar');
    self.elements.controlOverlay = $('#controlsOverlay');
    self.elements.controlContainer = $('#controlsContainer');
    self.elements.video = $('#player');
    self.elements.title = title;

    installHandlers();
  }

  module.exports = {
    init: init,
    setVideoTitle: setVideoTitle,
    onPause: onPause,
    onCanPlay: onCanPlay,
    onPlay: onPlay,
    onPlaying: onPlaying,
    onProgress: onProgress,
    onEnd: onEnd
  };

  /***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

  var mediaPlayer = __webpack_require__(1);
  var logger = __webpack_require__(0);

  var self = {};
  var ui = void 0;

  /**
   * Handle load content command
   */
  function loadContentHandler(playbackParams) {
    function loadContent(resolve, reject) {
      try {
        var content = JSON.parse(playbackParams.contentUri);
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
        message: '"Next" operation has not been implemented.'
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
        message: '"Previous" operation has not been implemented.'
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
          message: err.getMessage()
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
          message: err.getMessage()
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
      logger.debug('CC not currently implemented (state = ' + JSON.stringify(state) + ')');

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
    var _self$alexaInterface$;

    var eventNames = self.AlexaWebPlayerController.Event;

    self.alexaInterface.on((_self$alexaInterface$ = {}, _defineProperty(_self$alexaInterface$, eventNames.LOAD_CONTENT, loadContentHandler), _defineProperty(_self$alexaInterface$, eventNames.PAUSE, pauseHandler), _defineProperty(_self$alexaInterface$, eventNames.RESUME, resumeHandler), _defineProperty(_self$alexaInterface$, eventNames.NEXT, nextHandler), _defineProperty(_self$alexaInterface$, eventNames.PREVIOUS, previousHandler), _defineProperty(_self$alexaInterface$, eventNames.SET_SEEK_POSITION, setSeekPositionHandler), _defineProperty(_self$alexaInterface$, eventNames.ADJUST_SEEK_POSITION, adjustSeekPositionHandler), _defineProperty(_self$alexaInterface$, eventNames.CLOSED_CAPTIONS_STATE_CHANGE, closedCaptionsStateChangeHandler), _defineProperty(_self$alexaInterface$, eventNames.PREPARE_FOR_CLOSE, prepareForCloseHandler), _self$alexaInterface$));
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
        positionInMilliseconds: 0
      });

      logger.debug('alexa::handleReady - Player is ready for loadContent');
    }

    function handleFailure() {
      logger.debug('alexa::handleFailure');
    }

    if (_typeof(window.AlexaWebPlayerController) !== 'object') {
      throw new Error('AlexaWebPlayerController not found, unable to continue.');
    }

    logger.debug('alexa::initAlexa - AlexaWebPlayerController is available, initializing');

    // Save local reference to controller
    self.AlexaWebPlayerController = window.AlexaWebPlayerController;
    self.AlexaWebPlayerController.initialize(handleReady, handleFailure);
  }

  function init() {
    ui = __webpack_require__(2); // eslint-disable-line global-require
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
    init: init,
    setPlayerState: setPlayerState,
    setMetadata: setMetadata,
    showLoadingOverlay: showLoadingOverlay,
    close: close,
    sendError: sendError,
    setAllowedOperations: setAllowedOperations,
    getClosedCaptionsState: getClosedCaptionsState,
    setClosedCaptionsState: setClosedCaptionsState
  };

  /***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(3);
  __webpack_require__(5);
  __webpack_require__(1);
  __webpack_require__(2);
  module.exports = __webpack_require__(0);

  /***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

  var alexa = __webpack_require__(3);
  var ui = __webpack_require__(2);
  var logger = __webpack_require__(0);
  var mediaPlayer = __webpack_require__(1);

  function init() {
    logger.setLogLevel(logger.LogLevels.INFO);
    alexa.init();
    ui.init();
    mediaPlayer.init();
  }

  init();

  /***/
}]
/******/);