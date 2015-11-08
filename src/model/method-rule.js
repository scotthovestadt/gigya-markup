const _ = require('lodash');
const Rule = require('./rule.js');

/**
 * Rule that executes a method bound to element
 */
class MethodRule extends Rule {
  constructor({ method, defaults }) {
    super(arguments[0]);
    this._method = method;
    this._defaults = defaults;
  }

  /**
   * Merge defaults with params attached to element
   */
  _params($el) {
    return _.merge($el.data(), this._defaults);
  }

  /**
   * Call method
   */
  method($el) {
    // global = window
    // method = 'gigya.socialize.showLoginUI'
    // Will get method and call
    _.get(global, this._method)(this._params($el));
  }
}

module.exports = MethodRule;