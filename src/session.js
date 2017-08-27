/**
 * Session
 */
const dotty = require("dotty");

var Session = function() {
	this._data = {};
}


/**
 * Initialize
 *
 * @access public
 * @return void
 */
Session.prototype.initialize = function() {
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
Session.prototype.set_auth = function(source, value) {
	this._data.authorized[source] = value;
}


/**
 * Remove auth
 *
 * @param string source
 * @return void
 */
Session.prototype.remove_auth = function(source) {
	delete this._data.authorized[source];
}


/**
 * Check if authorized
 *
 * @param string source
 * @access public
 * @return boolean
 */
Session.prototype.authorized = function(source) {
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
Session.prototype.auth_ident = function(source) {
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
Session.prototype.auth = function(source, key) {
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
Session.prototype.add_account = function(identifier) {
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
Session.prototype.set_account = function(identifier) {
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
Session.prototype.set_data = function(data) {
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
Session.prototype.data = function(key) {
	return dotty.get(this._data, key);
}


/**
 * Set
 *
 * @param string key
 * @return void
 */
Session.prototype.set = function(key, value) {
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
Session.prototype.user = function(key, value) {
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
Session.prototype.add_history = function(data) {
	this._data.history.push(data);
}


/**
 * History
 *
 * @access public
 * @return mixed
 */
Session.prototype.history = function() {
	return this._data.history;
}


/**
 * Get expecting
 *
 * @access public
 * @return mixed
 */
Session.prototype.get_expecting = function() {
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
Session.prototype.set_expecting = function(expecting) {
	//If intent has been passed as an object then change it to the intent name (string)
	if(typeof expecting.intent === 'object') {
		expecting.intent = expecting.intent.name;
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
Session.prototype.has_expecting = function() {
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
Session.prototype.reset_expecting = function() {
	this._data.expecting = null;
}


module.exports = Session;


