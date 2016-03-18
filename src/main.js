import $ from 'jquery';
import bindIf from 'method/if.js';
import bindUi from 'method/ui.js';
import bindClick from 'method/click.js';
import account from 'singleton/account.js';

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
$(document).ready(() => {
  gy.render();
});