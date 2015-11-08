const _ = require('lodash');
const IfRule = require('../model/if-rule.js');

/**
 * Create two sets of rules, gy-show-if and gy-hide-if:
 * - gy-show-if elements are hidden by default and shown only when() = true
 * - gy-hide-if elements are shown by default and hidden only when() = true
 *
 * Internally, a rule's when() should return undefined when the value isn't yet known.
 */
const _rules = [
  { names: ['not-logged-in', 'logged-out'], when: ({ account }) => account.isInitialized() ? !account.isLoggedIn() : undefined },
  { names: ['logged-in', 'not-logged-out'], when: ({ account }) => account.isInitialized() ? account.isLoggedIn() : undefined }
];
const rules = _.map(_rules, (rule) => {
  rule.element = 'gy-show-if';
  return new IfRule(rule);
}).concat(_.map(_rules, (rule) => {
    rule.element = 'gy-hide-if';

    // By default, when() means to show element.
    // Reverse the value for gy-hide-if but leave undefined values untouched (do not typecast to false).
    const when = rule.when;
    rule.when = (params) => {
      const res = when(params);
      return res !== undefined ? !res : undefined; 
    };

    return new IfRule(rule);
  }));

/**
 * Bind to all elements in container (existing now or in future).
 *
 * @param {jQueryElement} $container
 */
module.exports = function bind($container) {
  _.each(rules, (rule) => {
    rule.bind($container);
  });
}
module.exports.rules = rules;