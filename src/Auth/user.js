/**
 * User
 */
const dotty = require("dotty");
const Randtoken = require('rand-token');

module.exports = class User {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
    this._data = {};
  }


/**
 * Load
 *
 * @param string user_id
 * @param hash user_data
 * @access public
 * @return void
 */
  load(user_id, user_data) {
    //User id
    this.user_id = user_id;

    //Hold auth user data
    this._data = user_data;
  }


/**
 * Get
 *
 * Return data based on the key
 *
 * @param string key
 * @access public
 * @return mixed
 */
  get(key) {
    if(!key) {
      return this._data;
    }
    return dotty.get(this._data, key);
  }
  

/**
 * Has
 *
 * Checks to see if a key for the user data exists
 *
 * @param string key
 * @access public
 * @return bool
 */
  has(key) {
    return dotty.get(this._data, key) ? true : false;
  }


/**
 * Set
 *
 * @param string key
 * @access public
 * @return void
 */
  set(key, value) {
    dotty.put(this._data, key, value);
  }


/**
 * Remove key
 *
 * @param string key
 * @access public
 * @return void
 */
  remove(key) {
    dotty.remove(this._data, key);
  }
  
}