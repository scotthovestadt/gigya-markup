import $ from 'jquery';
import Rule from 'model/rule.js';
import account from 'singleton/account.js';

/**
 * Rule that controls visibility of element(s).
 */
class IfRule extends Rule {
  /**
   * @param {Function} when
   */
  constructor({ when }) {
    super(arguments[0]);

    // Used to evaluate when value.
    this.when = when;
  }

  /**
   * If rule evaluates to true, element is visible; else false and invisible.
   *
   * @param $el {JQueryElement}
   */
  _visibility($el) {
    const isVisible = this.when({ account, $el });
    if(isVisible === true) {
      $el.show();
    } else if(isVisible === false) {
      $el.hide();
    }
  }

  /**
   * All elements that match selector in container when bound should be affected.
   *
   * @param $container {JQueryElements}
   */
  bind($container) {
    // Find all elements that match our rule selector.
    const $els = $(this._selector(), $container);

    // Don't bother if there aren't any elements.
    if($els.length === 0) {
      return;
    }

    $els.each((i, el) => {
      const $el = $(el);

      // The bind method can be called to refresh state, so ensure we don't bind events multiple times.
      // We do not need to refresh visibility every time this is called because it is keyed off account data only.
      if(!$el.data('gyIfBound')) {
        $el.data('gyIfBound', true);

        // Set visibility now.
        this._visibility($el);

        // Update visiblity if account data changes.
        account.on('changed', () => this._visibility($el));
      }
    });
  }
}

module.exports = IfRule;