const _ = require('lodash');
const $ = require('jquery');
const MethodRule = require('./method-rule.js');
const account = require('../singleton/account.js');

/**
 * Renders UI using attached method on elements.
 */
class UiRule extends MethodRule {
  /**
   * @param {Boolean} renderOnAccountChanged - Some Gigya UI methods need to be re-rendered when the user logs in or logs out.
   */
  constructor({ renderOnAccountChanged = false }) {
    super(arguments[0]);

    this.renderOnAccountChanged =  renderOnAccountChanged;
  }

  /**
   * Parse parameters from element attributes.
   *
   * @param {JQueryElement} $container
   * @return {Object}
   */
  _params({ $el }) {
    const params = super._params({ $el });

    // Add containerID parameter.
    params.containerID = $el.attr('id');

    // Automatically set width/height based on box model if not manually set.
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

  /**
   * @param {JQueryElement} $container
   */
  bind($container) {
    // Find all elements that match our rule selector.
    $(this._selector(), $container).each((i, el) => {
      const $el = $(el);
      
      // All UI elements must have IDs, assign if necessary.
      if($el.attr('id') === undefined) {
        $el.attr('id', _.uniqueId('gy-ui-'));
      }

      // onLoad handler and fallback if never triggered.
      let loaded = false;
      const onLoad = () => {
        loaded = true;
      };

      // Call Gigya method attached to the clicked element to render UI.
      if(this.method({ $el, overrideParams: { onLoad } }) === false) {
        // Returns false if the method fails to execute. Typically means Gigya SDK is not available.
        return this._failed({ $el });
      }

      // When the UI is loaded.
      const whenLoaded = () => {
        // Some Gigya UI methods need to be re-rendered when the user logs in or logs out.
        // Most don't, because they manage state internally.
        if(this.renderOnAccountChanged) {
          account.on('changed', () => {
            if(account.isInitialized()) {
              // Wait for elements to be shown or hidden before re-rendering UI.
              // Element must be visible to calculate box model for width and height.
              setTimeout(() => {
                this.method({ $el });
              }, 0);
            }
          });
        }
      }

      // Wait for UI to load.
      let attempts = 0;
      const waitForLoad = () => {
        setTimeout(() => {
          if(loaded) {
            whenLoaded();
          } else if(attempts <= 20) {
            attempts++;
            waitForLoad();
          } else {
            this._failed({ $el });
          }
        }, 500);
      }
      waitForLoad();

      return;
    });
  }

  /**
   * Triggered when UI cannot be rendered.
   */
  _failed({ $el }) {
    const params = this._params({ $el });
    const errorMessage = params.errorMessage || 'An error has occurred. Please try again later.';
    $el.text(errorMessage);
  }
}

module.exports = UiRule;