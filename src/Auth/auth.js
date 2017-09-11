/**
 * Auth
 */
const Session = require('./session.js');
const _ = require('underscore');
const Randtoken = require('rand-token');

module.exports = class Auth {

/**
 * Constructor
 *
 */
	constructor(App) {
		this.App = App;

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
 * @param Client client object
 * @return object Session
 */
	identify(identifier, Client) {
		let user = this.find_user(identifier);

		//If no user session record found then create one
		if(!user) {
			this.create(identifier);
			user = this.find_user(identifier);

			//Event
			this.App.Event.emit('auth.new', Client);
		}

		//Set data for session
		let session = new Session(this, Client);
		session.setup(identifier, user);
		
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

		let ident = Randtoken.generate(16);

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

