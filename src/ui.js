/* eslint-env jquery */
const logger = require('./util/logger');

let mediaPlayer = null;
const self = {
  isSlidingSeekBar: false,
  isControlEnabled: true,
  elements: {},
  controlTimeout: null,
  config: {
    CONTROL_FADE_OUT_DELAY_MILLISECONDS: 3000,
    CONTROL_FADE_OUT_DURATION_MILLISECONDS: 350,
    SKIP_TIME_INTERVAL_SECONDS: 10,
  },
};

/*
 * Utility and helper functions
 */
function fadeOutControlOverlay() {
  // Reset control fade out delay if set
  if (self.controlTimeout) {
    clearTimeout(self.controlTimeout);
  }

  self.elements.controlOverlay
    .removeClass('fadeIn fadeOut normal')
    .addClass('fadeOut');
  self.elements.controlContainer
    .removeClass('fadeIn fadeOut normal')
    .addClass('fadeOut');

  setTimeout(() => {
    self.isControlEnabled = false;
  }, self.config.CONTROL_FADE_OUT_DURATION_MILLISECONDS);
}

function fadeInControlOverlay() {
  // Reset control fade out delay if set
  if (self.controlTimeout) {
    clearTimeout(self.controlTimeout);
  }

  // Cancel previous animation if applicable
  self.elements.controlOverlay
    .removeClass('fadeIn fadeOut  normal')
    .addClass('fadeIn');
  self.elements.controlContainer
    .removeClass('fadeIn fadeOut normal')
    .addClass('fadeIn');
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
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
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
  logger.silly(`ui::onProgress(percent = ${value}`);
  const currentValue = self.elements.seekBar.get(0).value;
  let percent = Number.isNaN(value) ? 0 : value;
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
  const video = self.elements.video.get(0);
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
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
  const video = self.elements.video.get(0);
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
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
  const video = self.elements.video.get(0);
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;

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
  const video = self.elements.video.get(0);
  const value = self.elements.seekBar.val();

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
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;
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
  const delay = self.config.CONTROL_FADE_OUT_DELAY_MILLISECONDS;

  fadeInControlOverlay();

  // Reset control fade out delay
  if (self.controlTimeout) {
    clearTimeout(self.controlTimeout);
  }
  self.controlTimeout = setTimeout(fadeOutControlOverlay, delay);
}

function installHandlers() {
  const { elements } = self;

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
  const pageHeight = $(window).height();
  const pageWidth = $(window).width();
  // const pageWidth = $(window).height();
  const controlsContainer = $('#controlsContainer');
  const seekContainer = $('#seekContainer');
  const playerContainer = $('#playerContainer');
  const title = $('#title');

  // Delayed require to resolve circular dependency with webpack
  mediaPlayer = require('./mediaPlayer'); // eslint-disable-line global-require

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
  init,
  setVideoTitle,
  onPause,
  onCanPlay,
  onPlay,
  onPlaying,
  onProgress,
  onEnd,
};
