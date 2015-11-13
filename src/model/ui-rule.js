const _ = require('lodash');
const $ = require('jquery');
const MethodRule = require('./method-rule.js');
const account = require('../singleton/account.js');

/**
 * Renders UI using attached method on elements
 */
class UiRule extends MethodRule {
  constructor({ renderOnAccountChanged = false }) {
    super(arguments[0]);

    this.renderOnAccountChanged =  renderOnAccountChanged;
  }

  _params($el) {
    const params = super._params($el);

    // Add containerID parameter
    params.containerID = $el.attr('id');

    // Automatically set width/height based on box model if not manually set
    if(params.width === undefined) {
      params.width = $el.outerWidth();
      if(params.width === 0) {
        delete params.width;
      }
    }
    if(params.height === undefined) {
      params.height = $el.outerHeight();
      if(params.height === 0) {
        delete params.height;
      }
    }

    return params;
  }

  bind($container) {
    // Find all elements that match our rule selector
    $(this._selector(), $container).each((i, el) => {
      const $el = $(el);
      
      // All UI elements must have IDs, assign if necessary
      if($el.attr('id') === undefined) {
        $el.attr('id', _.uniqueId('gy-ui-'));
      }

      // Call Gigya method attached to the clicked element to render UI
      this.method($el);

      // Some Gigya UI methods need to be re-rendered when the user logs in or logs out
      // Most don't, because they manage state internally
      if(this.renderOnAccountChanged) {
        account.on('changed', () => {
          if(account.isInitialized()) {
            // Wait for elements to be shown or hidden before re-rendering UI
            // Element must be visible to calculate box model for width and height
            setTimeout(() => {
              this.method($el);
            }, 0);
          }
        });
      }
    });
  }
}

module.exports = UiRule;