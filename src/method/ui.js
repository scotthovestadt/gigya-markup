import _ from 'lodash';
import UiRule from 'model/ui-rule.js';
import bindAccountInfoUi from 'method/account-info-ui.js';

const rules = _.map([
  { name: 'login', method: 'gigya.socialize.showLoginUI', defaults: { hideGigyaLink: true, version: 2 } },
  { name: 'feed', method: 'gigya.socialize.showFeedUI' },
  { name: 'chat', method: 'gigya.chat.showChatUI' },
  { name: 'share-bar', method: 'gigya.socialize.showShareBarUI', defaults: { userAction: {} } },
  { name: 'comments', method: 'gigya.comments.showCommentsUI' },
  { name: 'rating', method: 'gigya.comments.showRatingUI' },
  { name: 'screen-set', method: 'gigya.accounts.showScreenSet' },
  { name: 'achievements', method: 'gigya.gm.showAchievementsUI' },
  { name: 'challenge-status', method: 'gigya.gm.showChallengeStatusUI' },
  { name: 'leaderboard', method: 'gigya.gm.showLeaderboardUI' },
  { name: 'user-status', method: 'gigya.gm.showUserStatusUI' },
  { name: 'account-info', method: bindAccountInfoUi }
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