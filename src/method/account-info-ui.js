import $ from 'jquery';
import account from 'singleton/account.js';

/**
 * Look up account field (supports dot notation) and display in element.
 *
 * @param {String} field - Account field, for example "profile.firstName"
 * @param {String} containerID - ID of DIV element to append span.
 * @param {Function} onLoad - Called after initial render.
 */
module.exports = function bindAccountInfoUi({ field, containerID, onLoad }) {
  const $container = $('#' + containerID);
  let $el = $container.find('span');
  if(!$el.length) {
    // Create span element to hold field text.
    $el = $('<span />');

    // Set field text.
    const setText = () => {
      // Get field text.
      let text = account.get(field);

      // Render array or object as JSON string. Mostly used for debugging.
      if(typeof text === 'object') {
        text = JSON.stringify(text, null, 2);
      }

      // Update DOM.
      $el.text(text !== undefined ? text : '');
    };
    setText();

    // Update field text if the account changes.
    account.on('changed', setText);

    // Append span to DOM.
    $container.append($el);
  }

  // Trigger onLoad if provided.
  if(onLoad) {
    onLoad();
  }
}