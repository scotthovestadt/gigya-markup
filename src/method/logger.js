module.exports = function(...args) {
  if(window.gy._isDebugModeEnabled && typeof console === 'object' && console.log) {
    console.log(...args);
  }
};

module.exports.error = function(...args) {
  if(typeof console === 'object' && console.error) {
    console.error(...args);
  }
};