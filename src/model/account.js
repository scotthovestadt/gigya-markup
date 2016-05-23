import _ from 'lodash';
import store from 'store';
import { EventEmitter } from 'events';

/**
 * Account singleton mirrors current Gigya user session.
 */
class Account extends EventEmitter {
  constructor() {
    super();

    // Don't bind to Gigya if SDK not available.
    const gigya = global.gigya;
    if(!gigya) {
      if(typeof console === 'object' && console.error) {
        console.error('Gigya SDK not available, cannot bind to account.');
      }
      return;
    }

    // When account information is updated check to see if changed.
    const accountFieldsToCheck = [
      'UID',
      'socialProviders',
      'isRegistered',
      'isVerified',
      'profile',
      'data',
      'loginIDs',
      'regToken'
    ];
    const onAccount = (account, fireEvents = true) => {
      // Was anything changed on account?
      let changed = false;

      // Always emit change event if this is the first account object we've got.
      if(!this.initialized) {
        this.initialized = true;
        changed = true;
      }

      // No UID means no account.
      const UID = _.get(account, 'UID');
      if(UID === undefined) {
        account = undefined;
      }

      // Need to do a selective check of account fields because some fields will change every time the account is fetched.
      if(!changed) {
        changed = _.some(accountFieldsToCheck, (accountField) => {
          return !_.isEqual(_.get(account, accountField), _.get(this.account, accountField));
        });
      }

      // Set new account object and emit changed event.
      if(changed) {
        const oldAccount = this.account || {};
        this.account = account;
        if(fireEvents) {
          this.emit('changed', { oldAccount, account: account || {} });
        }
      }
    };

    // When account information is changed cache login state to prevent flicker.
    if(store.enabled) {
      const localStorageKey = 'gy__account';
      this.on('changed', () => {
        store.set(localStorageKey, this.account);
      });
      const cachedAccount = store.get(localStorageKey);
      if(typeof cachedAccount === 'object' && !this.isInitialized()) {
        onAccount(cachedAccount, false);
      }
    }

    // Lowercased method names containing account information.
    const accountMethodNames = [
      'accounts.getaccountinfo',
      'accounts.sociallogin',
      'accounts.login',
      'accounts.finalizeregistration',
      'accounts.register',
      'socialize.notifylogin',
      'accounts.verifylogin',
      'accounts.linkaccounts'
    ];

    // Lowercased method names that should trigger us to call getAccountInfo.
    const triggerMethodNames = [
      'accounts.setaccountinfo'
    ];

    // The onLogin event doesn't contain the full Account object.
    // However, to generate the onLogin event, getAccountInfo may be called.
    // This will listen to ALL getAccountInfo calls and update the watched Account object.
    // It will also listen for other events carrying account information.
    gigya.events.addMap({
      eventMap: [{
        events: 'afterResponse',
        args: [(e) => { return e }],
        method: (e) => {
          // We rely on the event to have specific values. Check that it's safe before proceeding.
          if(typeof e !== 'object' || typeof e.methodName !== 'string' || typeof e.response !== 'object') {
            return;
          }

          // Normalize method name.
          const methodName = e.methodName.toLowerCase();

          // Many events contain account information that we want to push straight into our model.
          if(_.indexOf(accountMethodNames, methodName) !== -1) {
            onAccount(e.response);

          // Other events will trigger us to call getAccountInfo.
          } else if(_.indexOf(triggerMethodNames, methodName) !== -1) {
            gigya.accounts.getAccountInfo();
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
    return this.get('UID') !== undefined && this.get('isRegistered') && !this.get('regToken');
  }

  /**
   * Get field from account, supports dot notation.
   *
   * @param {String} field
   * @param {String} defaultValue
   * @return {String|Boolean|Array|Number|Object}
   */
  get(field, defaultValue) {
    return _.get(this.account, field, defaultValue);
  }
}

module.exports = Account;