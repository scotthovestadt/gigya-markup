const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

/**
 * Base class for all rules. Handles the logic for creating CSS selectors to find elements.
 */
class Rule extends EventEmitter {
  /**
   * @param {String} element - Selector prefix, for example "gy-show-if".
   * @param {String} name - Selector postfix, for example "not-logged-in".
   * @param {Array} names
   */
  constructor({ element, name, names }) {
    super();

    if(name) {
      names = [name];
    }

    this.element = element;
    this.names = names;
  }

  /**
   * Generates CSS selectors.
   *
   * @return {String}
   */
  _selector() {
    let selector = [];
    _.each(this.names, (name) => {
      selector.push(`.${this.element}-${name}`);
    });
    return selector.join(', ');
  }
}

module.exports = Rule;