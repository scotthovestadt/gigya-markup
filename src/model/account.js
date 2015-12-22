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
      // Was anything changed on account?
      let changed = false;

      // Always emit change event if this is the first account object we've got.
      if(!this.initialized) {
        this.initialized = true;
        changed = true;
      }

      // No UID means no account.
      if(typeof account !== 'object' || !account.UID) {
        account = undefined;
      }

      // Need to do a selective check of account fields because some fields will change every time the account is fetched.
      if(!changed) {
        if(typeof account !== typeof this.account ||
          account.UID !== this.account.UID ||
          account.socialProviders !== this.account.socialProviders ||
          account.isRegistered !== this.account.isRegistered ||
          account.isVerified !== this.account.isVerified ||
          !_.isEqual(account.profile, this.account.profile) ||
          !_.isEqual(account.data, this.account.data)) {
          changed = true;
        }
      }

      // Set new account object and emit changed event.
      if(changed) {
        this.account = account;
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