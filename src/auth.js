/**
 * Auth
 */
const Session = require('./session.js');
const _ = require('underscore');


module.exports = class Auth {

/**
 * Constructor
 *
 */
	constructor() {
		//Template record when adding new accounts
		this._templateRecord = {
			"ident": null,
			"authorized": {},
			"accounts": {},
			"user": {},
			"history": [],
			"api_token": "",
			"sub_domain": "firecreek",
			"current_account": null,
			"context": null,
			"history": [],
			"variables": {}
		};

		this.data = [];
	}


/**
 * Identify the user
 *
 * Based on the user_id from incoming we need to try and
 * match it to an existing session and then return a session
 * object. The session object is always returned but the
 * user might not be identified.
 *
 * AFAIK there is no reason to keep an array of sessions
 *
 * @param string user_id
 * @return object Session
 */
	identify(identifier) {
		let user = this.find_user(identifier);

		//If no user session record found then create one
		if(!user) {
			this.create(identifier);
			user = this.find_user(identifier);
		}

		//Set data for session
		let session = new Session();
		session.initialize();
		session.set_data(user);
		session.set_account(identifier);
		
		return session;
	}


/**
 * Identify the user
 *
 * Based on the user_id from incoming we need to try and
 * match it to an existing session and then return a session
 * object. The session object is always returned but the
 * user might not be identified.
 *
 * AFAIK there is no reason to keep an array of sessions
 *
 * @param string identifier
 * @return boolean
 */
	create(identifier) {
		if(!identifier) {
			return false;
		}

		let ident = Math.random().toString(36).substr(2, 12).toUpperCase();

		let data = JSON.parse(JSON.stringify(this._templateRecord));
		data.ident = ident;
		data.accounts[identifier] = {};

		this.data.push(data);

		return true;
	}


/**
 * Find user
 *
 * Find a user based on the identifier from incoming.
 *
 * @param string identifier
 * @return mixed hash or boolean
 */
	find_user(identifier) {
		for(var ii=0; ii < this.data.length; ii++) {
			if(_.has(this.data[ii].accounts, identifier)) {
				return this.data[ii];
			}
		}
		return false;
	}

}

