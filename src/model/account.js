const _ = require('lodash');
const EventEmitter = require('events');

/**
 * Account singleton mirrors current Gigya user session.
 */
class Account extends EventEmitter {
  constructor() {
    super();

    // When account information is updated.
    const onAccount = (account) => {
      let changed = false;
      if(!this.initialized) {
        this.initialized = true;
        changed = true;
      }
      if(!account.UID) {
        account = undefined;
      }
      if(!_.isEqual(account, this.account)) {
        this.account = account;
        changed = true;
      }
      if(changed) {
        this.emit('changed');
      }
    };

    // Don't bind to Gigya if SDK not available.
    const gigya = global.gigya;
    if(!gigya) {
      if(console && console.error) {
        console.error('Gigya SDK not available, cannot bind to account.');
      }
      return;
    }

    // The onLogin event doesn't contain the full Account object.
    // However, to generate the onLogin event, getAccountInfo is called.
    // This will listen to ALL getAccountInfo calls and update the watched Account object.
    gigya.events.addMap({
      eventMap: [{
        events: 'afterResponse',
        args: [function(e) { return e }],
        method: function(e) {
          if(typeof e === 'object' && (e.methodName === 'accounts.getAccountInfo' || e.methodName === 'accounts.socialLogin')) {
            onAccount(e.response);
          }
        }
      }]
    });

    // Bind to logout event.
    gigya.accounts.addEventHandlers({
      onLogout: onAccount
    });

    // Get current user session.
    // (Callback is the event binding above.)
    gigya.accounts.getAccountInfo();
  }

  /**
   * @return {Boolean}
   */
  isInitialized() {
    return !!this.initialized;
  }

  /**
   * @return {Boolean}
   */
  isLoggedIn() {
    return !!this.get('UID');
  }

  /**
   * Get field from account, supports dot notation.
   *
   * @return {String|Boolean|Array|Number}
   */
  get(field) {
    return _.get(this.account, field);
  }
}

module.exports = Account;