const $ = require('jquery');
const account = require('./../singleton/account.js');

/**
 * Look up account field (supports dot notation) and display in element.
 *
 * @param {String} field - Account field, for example "profile.firstName"
 * @param {String} containerID - ID of DIV element to append span.
 */
module.exports = function accountInfoUi({ field, containerID, onLoad }) {
  // Create span element to hold field text.
  const $el = $('<span />');

  // Set field text.
  let currentText = undefined;
  const setText = () => {
    // Get field text.
    const text = account.get(field);

    // Don't touch the DOM if the text hasn't changed.
    if(currentText === text) {
      return;
    }

    // Update DOM.
    $el.text(text !== undefined ? text : '');
  };
  setText();

  // Update field text if the account changes.
  account.on('changed', setText);

  // Append span to DOM.
  $('#' + containerID).append($el);

  // Trigger onLoad if provided.
  if(onLoad) {
    onLoad();
  }
}