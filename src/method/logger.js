module.exports = function(...args) {
  if(window.gy._isDebugModeEnabled && typeof console === 'object' && console.log) {
    console.log(...args);
  }
};