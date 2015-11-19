const $ = require('jquery');
const Rule = require('./rule.js');
const account = require('../singleton/account.js');

/**
 * Rule that controls visibility of element(s).
 */
class IfRule extends Rule {
  constructor({ when }) {
    super(arguments[0]);

    // Used to evaluate when value, passes all arguments.
    this._when = () => {
      return when({ account });
    };

    // Check for change to when value if account changes.
    account.on('changed', () => this._onDigest());

    // Calculate initial when value.
    this.when = this._when();
  }

  /**
   * Emit "changed" if our when() value changes. Listened to internally.
   */
  _onDigest() {
    let newWhen = this._when();
    if(this.when !== newWhen) {
      this.when = newWhen;
      this.emit('changed');
    }
  }

  /**
   * If rule evaluates to true, element is visible; else false and invisible.
   */
  _visibility($el) {
    if(this.when === true) {
      $el.show();
    } else if(this.when === false) {
      $el.hide();
    }
  }

  /**
   * All elements that match selector in container when bound should be affected.
   */
  bind($container) {
    // Find all elements that match our rule selector.
    const $el = $(this._selector(), $container);

    // Don't bother if there aren't any elements.
    if($el.length === 0) {
      return;
    }

    // Set visibility now.
    this._visibility($el);

    // Update visiblity if when changes.
    this.on('changed', () => this._visibility($el));
  }
}

module.exports = IfRule;