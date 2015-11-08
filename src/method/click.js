const _ = require('lodash');
const ClickRule = require('../model/click-rule.js');

const rules = _.map([
  { name: 'share', method: 'gigya.socialize.showShareUI', defaults: { userAction: {} } },
  { name: 'screen-set', method: 'gigya.accounts.showScreenSet'},
  { name: 'login', method: 'gigya.socialize.login' },
  { name: 'logout', method: 'gigya.socialize.logout' }
], (rule) => new ClickRule(_.merge(rule, { element: 'gy-click' })));

/**
 * Bind to clickable elements to trigger method with parameters on click in container (now or in future).
 *
 * @param {jQueryElement} $container
 */
module.exports = function bind($container) {
  _.each(rules, (rule) => {
    rule.bind($container);
  });
}
module.exports.rules = rules;