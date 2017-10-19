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
	constructor(Auth, Client) {
		this.Auth = Auth;
		this.App = Auth.App;
		this.Client = Client;

		this._data = {};
	}


/**
 * Setup
 *
 * @param string source
 * @param boolean value
 * @return void
 */
	setup(identifier, user) {
		this.set_data(user);
		this.set_account(identifier);
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
 * @return void
 */
	add_account(identifier) {
		this._data.accounts[identifier] = {};
	}


/**
 * Set account
 *
 * Current session account this person is using
 *
 * @param hash data
 * @return void
 */
	set_account(identifier) {
		this.add_account(identifier);
	}


/**
 * Set data
 *
 * User data for the system. This is not API data from devi etc...
 *
 * @param hash data
 * @return void
 */
	set_data(data) {
		this._data = data;
	}


/**
 * Data
 *
 * Return data based on the key
 *
 * @param string key
 * @return mixed
 */
	data(key) {
		return dotty.get(this._data, key);
	}
	

/**
 * Has
 *
 * Checks to see if a key for the user data exists
 *
 * @param string key
 * @return bool
 */
	has(key) {
		return dotty.get(this._data, key) ? true : false;
	}


/**
 * Set
 *
 * @param string key
 * @return void
 */
	set(key, value) {
		dotty.put(this._data, key, value);
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


/**
 * Add history
 *
 * @param object data
 * @access public
 * @return void
 */
	add_history(data) {
		this._data.history.push(data);
	}


/**
 * History
 *
 * @access public
 * @return mixed
 */
	history() {
		return this._data.history;
	}


/**
 * Get expecting
 *
 * @access public
 * @return mixed
 */
	get_expecting() {
		var result = this.data('expecting');
		return result ? result : false;
	}


/**
 * Set expecting
 *
 * @param hash expecting
 * @access public
 * @return void
 */
	set_expecting(expecting) {
		//If intent has been passed as an object then change it to the intent name (string)
		if(typeof expecting.intent === 'object') {
			expecting.intent = expecting.intent.identifier;
		}
		this.set('expecting',expecting);
	}


/**
 * Has expecting
 *
 * Check if has expecting variable set
 *
 * @access public
 * @return boolean
 */
	has_expecting() {
		if(this._data.expecting) {
			return true;
		}
		return false;
	}


/**
 * Reset expecting
 *
 * @access public
 * @return boolean
 */
	reset_expecting() {
		this._data.expecting = null;
	}

}