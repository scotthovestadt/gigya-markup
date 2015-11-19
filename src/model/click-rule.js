const _ = require('lodash');
const $ = require('jquery');
const MethodRule = require('./method-rule.js');

/**
 * Rule that executes method when element clicked.
 */
class ClickRule extends MethodRule {
  bind($container) {
    // Bind click event.
    $($container).on('click.ClickRule', this._selector(), (e) => {
      // Call Gigya method attached to the clicked element.
      this.method({ $el: $(e.target) });

      // Cancel default click event.
      e.preventDefault();
    });
  }
}

module.exports = ClickRule;