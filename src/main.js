import $ from 'jquery';
import bindIf from 'method/if.js';
import bindUi from 'method/ui.js';
import bindClick from 'method/click.js';
import account from 'singleton/account.js';
import bindAccountInfoUi from 'method/account-info-ui.js';
import registerTransformer from 'method/register-transformer.js';

(function() {
  // Don't bind to Gigya if SDK not available.
  const gigya = global.gigya;
  if(!gigya) {
    if(typeof console === 'object' && console.error) {
      console.error('Gigya SDK not available, cannot bind to account.');
    }
    return;
  }

  // Expose public namespace.
  const gy = window.gy = {
    // Render all markup in correct order.
    render: ({ el } = {}) => {
      const $el = el ? $(el) : $('body');
      bindIf($el);
      bindUi($el);
      bindClick($el);
    },

    // Expose account singleton.
    account,

    // Expose account info UI.
    // Follow Gigya naming conventions.
    showAccountInfoUI: bindAccountInfoUi,

    // Register transformation function.
    // Expects { afterFetch: Function, beforeSave: Function }
    registerTransformer,

    // Enable debug mode which prints logs to console.
    _isDebugModeEnabled: false,
    enableDebugMode: () => {
      gy._isDebugModeEnabled = true;
    }
  };

  // Render automatically.
  $(document).ready(() => gy.render());
  
  // Try again in window load event to allow for dynamically rendered elements.
  $(window).load(() => gy.render());

  // Every time a user clicks.
  $(window).click(() => gy.render());
})();