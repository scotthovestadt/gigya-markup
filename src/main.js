const $ = require('jquery');

// Expose bind methods on public namespace.
const gy = window.gy = {};
gy.ui = require('./method/ui.js');
gy.if = require('./method/if.js');
gy.click = require('./method/click.js');
gy.accountInfoUi = require('./method/account-info-ui.js');

// When document ready, bind automatically.
$(document).ready(() => {
  const $body = $('body');
  gy.ui($body);
  gy.if($body);
  gy.click($body);
});