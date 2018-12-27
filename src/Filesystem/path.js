/**
 * Path
 */
const dotty = require("dotty");
const Config = require('../Config/config.js');

module.exports = class Path {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor(app) {
    this.paths = Config.read('paths');
  }


/**
 * Get
 *
 * @param string key
 * @access public
 * @return void
 */
  get(key) {
		return dotty.get(this.paths, key);
  }


/**
 * Set
 *
 * @param string key
 * @param string value
 * @access public
 * @return mixed
 */
  set(key, value) {
		dotty.put(this.paths, key, value);
  }


/**
 * Get
 *
 * @param string key
 * @param string value
 * @access public
 * @return mixed
 */
  append(key, value) {

  }


}
