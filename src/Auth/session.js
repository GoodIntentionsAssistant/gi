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
 * Set authorized
 *
 * If the user has been successfully identified then we
 * set the private variable to true so we can check later.
 *
 * @param string source
 * @param boolean value
 * @return void
 */
	set_auth(source, value) {
		this._data.authorized[source] = value;
	}


/**
 * Remove auth
 *
 * @param string source
 * @return void
 */
	remove_auth(source) {
		delete this._data.authorized[source];
	}


/**
 * Check if authorized
 *
 * @param string source
 * @access public
 * @return boolean
 */
	authorized(source) {
		if(!(source in this._data.authorized)) {
			return false;
		}
		return this._data.authorized[source];
	}


/**
 * Auth ident
 *
 * Identifier for this session which needs to also include the api token.
 * This method is used for loading entity live data with session.
 *
 * @param string source
 * @access public
 * @return mixed
 */
	auth_ident(source) {
		if(!this._data.authorized[source]) {
			return false;
		}

		var output = this.data('ident');
		output = output +'-'+this._data.authorized[source]['api_token'];
		return output;
	}


/**
 * Turn auth data
 *
 * @param string source
 * @param string key
 * @access public
 * @return mixed
 */
	auth(source, key) {
		if(!this._data.authorized[source]) {
			return false;
		}
		return dotty.get(this._data.authorized[source], key);
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


/**
 * User data
 *
 * @param string key
 * @param string value for setting
 * @access public
 * @return mixed
 */
	user(key, value) {
		if(!value) {
			return this.data('user.'+key);
		}
		return this.set('user.'+key,value);
	}

}