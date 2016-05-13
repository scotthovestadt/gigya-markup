import $ from 'jquery';
import bindIf from 'method/if.js';
import bindUi from 'method/ui.js';
import bindClick from 'method/click.js';
import account from 'singleton/account.js';

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
    account
  };

  // Render automatically.
  $(document).ready(() => gy.render());
  
  // Try again in window load event to allow for dynamically rendered elements.
  $(window).load(() => gy.render());
})();