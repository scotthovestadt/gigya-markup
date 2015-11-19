const Account = require('../model/account.js');

// Init single instance of Account.
const account = new Account();

// Prevent "possible EventEmitter memory leak detected".
account.setMaxListeners(100);

module.exports = account;