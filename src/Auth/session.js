/**
 * Session
 */
const User = require('./user.js');
const dotty = require("dotty");

module.exports = class Session {

/**
 * Constructor
 *
 * @param {Object} auth Auth object
 */
	constructor(auth) {
		this.auth = auth;
		this._data = {};
	}


/**
 * Load
 *
 * @param {string} session_id Session id
 * @param {Object} session_data Session data
 * @returns {boolean}
 */
	load(session_id, session_data) {
		//Session id
		this.session_id = session_id;

		//Hold auth session data
		this._data = session_data;

		return true;
	}


/**
 * Add account
 *
 * If the user has been successfully identified then we
 * set the private variable to true so we can check later.
 *
 * @param {boolean} value Token to add to session
 * @returns {boolean}
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
 * @returns {*}
 */
	get(key) {
		if(!key) {
			return this._data;
		}
		return dotty.get(this._data, key);
	}


/**
 * Data
 *
 * @todo Remove this and change to get::
 * @param {string} key Get data by key
 * @returns {*}
 */
	data(key) {
		return this.get(key);
	}
	

/**
 * Has
 *
 * Checks to see if a key for the user data exists
 *
 * @param {string} key Key to check if it exists
 * @returns {*}
 */
	has(key) {
		return dotty.get(this._data, key) ? true : false;
	}


/**
 * Set
 *
 * @param {string} key Key to set
 * @returns {boolean}
 */
	set(key, value) {
		return dotty.put(this._data, key, value);
	}


/**
 * Remove key
 *
 * @param {string} key Key to remove
 * @returns {boolean}
 */
	remove(key) {
		return dotty.remove(this._data, key);
	}

}