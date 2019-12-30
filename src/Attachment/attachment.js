/**
 * Attachment
 */

module.exports = class Attachment {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.app = app;
    this.multiple = true;
  }


/**
 * Load
 *
 * @returns {boolean}
 */
  load() {
    return true;
  }

}