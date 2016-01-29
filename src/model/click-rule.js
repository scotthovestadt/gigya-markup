import _ from 'lodash';
import $ from 'jquery';
import MethodRule from 'model/method-rule.js';

/**
 * Rule that executes method when element clicked.
 */
class ClickRule extends MethodRule {
  /**
   * @param {JQueryElements} $container
   */
  bind($container) {
    // Bind to click event.
    $($container).on('click.GyClickRule', this._selector(), (e) => {
      // Call Gigya method attached to the clicked element.
      this.method({ $el: $(e.target) });

      // Cancel default click event.
      e.preventDefault();
    });
  }
}

module.exports = ClickRule;