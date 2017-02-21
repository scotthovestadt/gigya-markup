import _ from 'lodash';
import UiRule from 'model/ui-rule.js';

/**
 * Re-render screenset containing form on log out.
 *
 * This prevents a state where you login and logout only to see the registration form still pre-populated.
 *
 * @param {Object} oldAccount
 * @param {Object} account
 * @param {jQueryElement} $el
 */
function screensetCheckForRender({ oldAccount, account, $el }) {
  if(oldAccount.UID !== account.UID && $el.find('form').length && account.UID === undefined) {
    return true;
  }
}

const rules = _.map([
  { name: 'login', method: 'gigya.socialize.showLoginUI', defaults: { hideGigyaLink: true, showTermsLink: false, version: 2 } },
  { name: 'add-connections', method: 'gigya.socialize.showAddConnectionsUI', defaults: { hideGigyaLink: true, showTermsLink: false, version: 2 } },
  { name: 'edit-connections', method: 'gigya.socialize.showEditConnectionsUI', defaults: { hideGigyaLink: true, showTermsLink: false } },
  { name: 'feed', method: 'gigya.socialize.showFeedUI' },
  { name: 'chat', method: 'gigya.chat.showChatUI' },
  { name: 'share-bar', method: 'gigya.socialize.showShareBarUI', defaults: { userAction: {} } },
  { name: 'comments', method: 'gigya.comments.showCommentsUI', defaults: { width: '100%' } },
  { name: 'rating', method: 'gigya.comments.showRatingUI' },
  { name: 'screen-set', method: 'gigya.accounts.showScreenSet', defaults: { width: '100%' }, checkForRender: screensetCheckForRender },
  { name: 'achievements', method: 'gigya.gm.showAchievementsUI' },
  { name: 'challenge-status', method: 'gigya.gm.showChallengeStatusUI' },
  { name: 'leaderboard', method: 'gigya.gm.showLeaderboardUI' },
  { name: 'user-status', method: 'gigya.gm.showUserStatusUI' },
  { name: 'account-info', method: 'gy.showAccountInfoUI' }
], (rule) => new UiRule(_.merge(rule, { element: 'gy-ui' })));

/**
 * Bind to all elements in container (existing now or in future).
 *
 * @param {jQueryElement} $container
 */
module.exports = function bindUi($container) {
  _.each(rules, (rule) => {
    rule.bind($container);
  });
}
module.exports.rules = rules;