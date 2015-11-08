const _ = require('lodash');
const $ = require('jquery');
const MethodRule = require('./method-rule.js');

/**
 * Renders UI using attached method on elements
 */
class UiRule extends MethodRule {
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
      this.method($(el));
    });
  }
}

module.exports = UiRule;