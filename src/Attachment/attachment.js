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

    this._key = null;
    this._data = {};
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


/**
 * Set key for attachment
 *
 * @param hash dash
 * @access public
 * @return bool
 */
  key(name = null) {
    if(!name) {
      return this._key;
    }
    this._key = name;
    return true;
  }


/**
 * Set data
 *
 * @param hash dash
 * @access public
 * @return bool
 */
  set(data) {
    this._data = data;
    return true;
  }


/**
 * Get data
 *
 * @access public
 * @return hash
 */
  get() {
    return this._data;
  }

}