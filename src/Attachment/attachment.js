/**
 * Attachment
 */

module.exports = class Attachment {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    this.app = app;
    this.multiple = true;
  }


/**
 * Load
 *
 * @access public
 * @return bool
 */
  load() {
    return true;
  }

}