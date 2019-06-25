/* eslint-env jquery */
const ui = require('./ui');
const logger = require('./util/logger');

let alexa = null;
const self = {
  video: null,
};

/**
 *
 */
function onPause() {
  ui.onPause();
  alexa.setPlayerState({
    state: window.AlexaWebPlayerController.State.PAUSED,
    positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10),
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
    positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10),
  });
}

/**
 *
 */
function onWaiting() {
  alexa.setPlayerState({
    state: window.AlexaWebPlayerController.State.BUFFERING,
    positionInMilliseconds: parseInt(self.video.currentTime * 1000, 10),
  });
}

/**
 *
 */
function onEnd() {
  ui.onEnd();
  alexa.setPlayerState({
    state: window.AlexaWebPlayerController.State.IDLE,
    positionInMilliseconds: parseInt(0, 10),
  });

  // Inform Alexa we are ready to close
  alexa.close();
}

/**
 *
 */
function onTimeUpdate() {
  // Calculate the slider value
  const value = (100 / self.video.duration) * self.video.currentTime;

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
  logger.debug(`mediaPlayer::onerror (code: ${self.video.error.code}; message: ${self.video.error.message}`);
}

/*
 * Command Handlers
 */

/**
 *
 * @param {*} playbackParams
 */
function load(playbackParams) {
  const { video } = self;
  const { contentUri, offsetInMilliseconds, autoplay } = playbackParams;
  const source = document.createElement('source');
  const { streamUrl, title } = JSON.parse(contentUri);

  // Set the video content based on contentUri being a stream URL
  source.setAttribute('src', streamUrl);

  // Set type based on extension loosely found in URL
  if (contentUri.indexOf('.mp4') >= 0) {
    source.setAttribute('type', 'video/mp4');
  } else if (contentUri.indexOf('.m3u8') >= 0) {
    source.setAttribute('type', 'application/x-mpegURL');
  } else {
    logger.debug(`Unhandled video type for url: ${streamUrl}`);
    throw new Error({
      errorType: alexa.ErrorType.INVALID_CONTENT_URI,
    });
  }

  video.innerHTML = '';
  video.appendChild(source);

  // Set metadata for current content in Alexa
  alexa.setMetadata({
    title,
  });

  // Set allowed operations
  alexa.setAllowedOperations({
    adjustRelativeSeekPositionForward: true,
    adjustRelativeSeekPositionBackwards: true,
    setAbsoluteSeekPositionForward: true,
    setAbsoluteSeekPositionBackwards: true,
    next: false,
    previous: false,
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
  let newTime = offsetInSeconds;

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
  const player = $('#player');

  // Delay to avoid circular dependency
  alexa = require('./alexa'); // eslint-disable-line global-require

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
  init,
  load,
  pause,
  resume,
  setPosition,
  adjustPosition,
};
