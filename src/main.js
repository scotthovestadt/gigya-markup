import $ from 'jquery';
import bindIf from 'method/if.js';
import bindUi from 'method/ui.js';
import bindClick from 'method/click.js';
import bindAccountInfoUi from 'method/account-info-ui.js';

// Expose bind methods on public namespace.
const gy = window.gy = {
  bindIf,
  bindUi,
  bindClick,
  bindAccountInfoUi
};

// When document ready, bind automatically.
$(document).ready(() => {
  const $body = $('body');
  gy.bindIf($body);
  gy.bindUi($body);
  gy.bindClick($body);
});