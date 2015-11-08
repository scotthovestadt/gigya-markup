const _ = require('lodash');
const $ = require('jquery');
const MethodRule = require('./method-rule.js');

/**
 * Rule that executes method when element clicked
 */
class ClickRule extends MethodRule {
  bind($container) {
    // Find all elements that match our rule selector
    $($container).on('click.ClickRule', this._selector(), (e) => {
      // Call Gigya method attached to the clicked element
      this.method($(e.target));

      // Cancel default click event
      e.preventDefault();
    });
  }
}

module.exports = ClickRule;