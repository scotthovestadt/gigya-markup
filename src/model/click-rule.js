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
    const uniqueId = 'gyClickBound_' + this._method;

    // Do not re-bind if click event already bound to container.
    if($container.data(uniqueId)) {
      return;
    }

    // Bind to click event.
    $container.data(uniqueId, true);
    $container.on('click.' + uniqueId, this._selector(), (e) => {
      // Call Gigya method attached to the clicked element.
      this.method({ $el: $(e.target) });

      // Cancel default click event.
      e.preventDefault();
    });
  }
}

module.exports = ClickRule;