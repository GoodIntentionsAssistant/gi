/**
 * Session
 */
const User = require('./user.js');
const dotty = require("dotty");

module.exports = class Session {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor(auth) {
		this.auth = auth;

		this._data = {};
	}


/**
 * Load
 *
 * @param string session_id
 * @param hash session_data
 * @access public
 * @return void
 */
	load(session_id, session_data) {
		//Session id
		this.session_id = session_id;

		//Hold auth session data
		this._data = session_data;
	}


/**
 * Add account
 *
 * If the user has been successfully identified then we
 * set the private variable to true so we can check later.
 *
 * @param boolean value
 * @access public
 * @return void
 */
	add_token(token) {
		this._data.tokens[token] = {};
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
		return dotty.get(this._data, key);
	}


/**
 * Data
 *
 * @todo Remove this and change to get::
 * @param string key
 * @access public
 * @return mixed
 */
	data(key) {
		return this.get(key);
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