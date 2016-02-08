import _ from 'lodash';
import $ from 'jquery';
import MethodRule from 'model/method-rule.js';
import account from 'singleton/account.js';

/**
 * Renders UI using attached method on elements.
 */
class UiRule extends MethodRule {
  /**
   * Parse parameters from element attributes.
   *
   * @param {JQueryElement} $el
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

      // Render element. If element is blank, re-render when account status changes.
      // Elements may not be rendered initially if the account isn't initialized or they are hidden.
      // Additionally, Gigya login/registration screenset de-render themselves after logging in.
      // The user may toggle back and forth between being logged in and logging out.
      const initialHtml = $el.html();
      this._render({ $el });
      account.on('changed', () => {
        const html = $el.html();
        if(!html || html === initialHtml) {
          this._render({ $el });
        }
      });
    });
  }

  /**
   * Used to render UI.
   *
   * @param {JQueryElement} $el
   */
  _render({ $el }) {
    // Do not render if account is not yet initialized or in hidden container.
    if(!account.isInitialized() || $el.is(':hidden') === true) {
      return;
    }

    // onLoad handler and fallback if never triggered.
    const onLoad = () => {
      $el.data('loaded', true);
    };

    // Call Gigya method attached to the clicked element to render UI.
    if(this.method({ $el, overrideParams: { onLoad } }) === false) {
      // Returns false if the method fails to execute. Typically means Gigya SDK is not available.
      return this._failed({ $el });
    }

    // Wait for UI to load.
    let attempts = 0;
    const waitForLoad = () => {
      setTimeout(() => {
        if($el.data('loaded') === true) {
          // Done.
        } else if(attempts <= 20) {
          attempts++;
          waitForLoad();
        } else {
          this._failed({ $el });
        }
      }, 500);
    }
    waitForLoad();
  }

  /**
   * Triggered when UI cannot be rendered.
   *
   * @param {JQueryElement} $el
   */
  _failed({ $el }) {
    const params = this._params({ $el });
    const errorMessage = params.errorMessage || 'An error has occurred. Please try again later.';
    $el.text(errorMessage);
  }
}

module.exports = UiRule;