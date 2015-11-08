const $ = require('jquery');
const account = require('./../singleton/account.js');

/**
 * Look up account field (supports dot notation) and display in span.
 *
 * @param {String} field - Account field, for example "profile.firstName"
 * @param {String} containerID - ID of DIV element to append span.
 */
module.exports = function accountInfoUi({ field, containerID }) {
  const $el = $('<span />');
  const setText = () => {
    const text = account.get(field);
    $el.text(text !== undefined ? text : '');
  };
  setText();
  account.on('changed', setText);
  $('#' + containerID).append($el);
}