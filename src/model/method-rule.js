const _ = require('lodash');
const Rule = require('./rule.js');

// Create map of lowercased param names to correctly cased param names.
const normalizedParamNames = {};
_.each(['containerID', 'streamID', 'categoryID', 'UID', 'feedID', 'linkedCommentsUI', 'countURL',
        'shortURLs', 'autoShareActionID', 'barID'], (paramName) => {
  normalizedParamNames[paramName.toLowerCase()] = paramName;
});

/**
 * Abstract rule that executes a method bound to element. Extended by other rules.
 */
class MethodRule extends Rule {
  constructor({ method, defaults }) {
    super(arguments[0]);
    this._method = method;
    this._defaults = defaults;
  }

  /**
   * Merge defaults with params attached to element.
   *
   * @param {JQueryElement} $el
   * @return {Object}
   */
  _params({ $el }) {
    // Get camel cased parameters from element data.
    const params = $el.data();

    // Normalize parameters to Gigya casing.
    // Handles method names that aren't camel cased, like containerID, streamID and UID.
    _.each(params, (value, key) => {
      if(normalizedParamNames[key.toLowerCase()]) {
        delete params[key];
        params[normalizedParamNames[key.toLowerCase()]] = value;
      }
    });

    // Merge parameters with defaults
    return _.merge({}, this._defaults, params);
  }

  /**
   * Call method on Gigya SDK.
   *
   * @param {JQueryElement} $el
   */
  method({ $el, overrideParams }) {
    // global = window
    // method = 'gigya.socialize.showLoginUI' or similar (string).
    // Will get method from Gigya namespace on window and execute.
    try {
      const params = _.merge(this._params({ $el }), overrideParams);
      _.get(global, this._method)(params);
    } catch(e) {
      if(console && console.error) {
        console.error(`Failed to call method "${this._method}"`, e);
        if(e && e.stack) {
          console.error(e.stack);
        }
      }
      return false;
    }
  }
}

module.exports = MethodRule;