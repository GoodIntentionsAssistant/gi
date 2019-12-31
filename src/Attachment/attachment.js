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
  }


/**
 * Load
 *
 * @returns {boolean} Success of loading
 */
  load() {
    return true;
  }


/**
 * Build
 *
 * @param {*} data Data to pass to attachment
 * @returns {*} Attachment reply
 */
  build(data, ...args) {
    return this._build(data, ...args);
  }

}