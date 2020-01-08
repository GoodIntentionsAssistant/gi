/**
 * Session
 */
const dotty = require("dotty");

module.exports = class Session {

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
 * @param {string} session_id Session id
 * @param {Object} session_data Session data
 * @returns {boolean} If loading was successful
 */
	load(session_id, session_data) {
		//Session id
		this.session_id = session_id;

		//Hold auth session data
		this._data = session_data;
		this._data.tokens = {};

		return true;
	}


/**
 * Add account
 *
 * If the user has been successfully identified then we
 * set the private variable to true so we can check later.
 *
 * @param {boolean} token Token to add to session
 * @returns {boolean} Success of adding the token
 */
	add_token(token) {
		this._data.tokens[token] = {};
		return true;
	}


/**
 * Get
 *
 * Return data based on the key
 *
 * @param {string} key Get data by key
 * @returns {*} Value of the key
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
 * @returns {boolean} If the key exists
 */
	has(key) {
		return dotty.get(this._data, key) ? true : false;
	}


/**
 * Set
 *
 * @param {string} key Key to set
 * @param {string} value Value for key
 * @returns {boolean} If setting was successful
 */
	set(key, value) {
		return dotty.put(this._data, key, value);
	}


/**
 * Remove key
 *
 * @param {string} key Key to remove
 * @returns {boolean} If removing was successful
 */
	remove(key) {
		return dotty.remove(this._data, key);
	}

}