/**
 * User
 */
const dotty = require("dotty");

module.exports = class User {

/**
 * Constructor
 *
 * @constructor
 */
	constructor() {
    this._data = {};
  }


/**
 * Load
 *
 * @param {string} user_id User id
 * @param {Object} user_data User data
 * @returns {boolean} Success of loading instance
 */
  load(user_id, user_data) {
    //User id
    this.user_id = user_id;

    //Hold auth user data
    this._data = user_data;

    return true;
  }


/**
 * Get
 *
 * Return data based on the key
 *
 * @param {string} key Get data by key
 * @returns {*} Key value
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
 * @param {string} key Key to check if it exists
 * @returns {boolean} If the key exists in the user data
 */
  has(key) {
    return dotty.get(this._data, key) ? true : false;
  }


/**
 * Set
 *
 * @param {string} key Key to set
 * @param {string} value Value for the key
 * @returns {boolean} If setting the key with the value was successful
 */
  set(key, value) {
    return dotty.put(this._data, key, value);
  }


/**
 * Remove key
 *
 * @param {string} key Key to remove
 * @returns {boolean} If removing the key was successful
 */
  remove(key) {
    return dotty.remove(this._data, key);
  }
  
}