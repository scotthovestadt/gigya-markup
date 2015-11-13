const _ = require('lodash');
const EventEmitter = require('events');
const gigya = require('../lib/gigya.js');

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
    if(!gigya) {
      if(console && console.error) {
        console.error('Gigya SDK not available, cannot bind to account.');
      }
      return;
    }

    // Bind to account events.
    gigya.accounts.addEventHandlers({
      onLogin: onAccount,
      onLogout: onAccount
    });

    // Get user session.
    gigya.accounts.getAccountInfo({
      callback: onAccount
    });
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