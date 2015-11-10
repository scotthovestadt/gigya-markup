const _ = require('lodash');
const Rule = require('./rule.js');

// Create map of lowercased param names to correctly cased param names
const normalizedParamNames = {};
_.each(['containerID', 'streamID', 'categoryID', 'UID', 'feedID', 'linkedCommentsUI'], (paramName) => {
  normalizedParamNames[paramName.toLowerCase()] = paramName;
});


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
    // Get camel cased parameters from element data
    const params = $el.data();

    // Normalize parameters to Gigya casing
    // Handles method names that aren't camel cased, like containerID, streamID and UID
    _.each(params, (value, key) => {
      if(normalizedParamNames[key.toLowerCase()]) {
        delete params[key];
        params[normalizedParamNames[key.toLowerCase()]] = value;
      }
    });

    // Merge parameters with defaults
    return _.merge(params, this._defaults);
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