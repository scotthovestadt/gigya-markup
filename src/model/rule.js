const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

/**
 * Extends EventEmitter to allow it to emit events
 */
class Rule extends EventEmitter {
  constructor({ element, name, names }) {
    super();

    if(name) {
      names = [name];
    }

    this.element = element;
    this.names = names;
  }

  /**
   * Generates CSS selector
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