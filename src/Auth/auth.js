/**
 * Auth
 *
 * A user has many sessions
 */
const _ = require('underscore');
const Randtoken = require('rand-token');

const Config 	= girequire('/src/Config/config.js');
const User 		= girequire('/src/Auth/user.js');
const Session = girequire('/src/Auth/session.js');

module.exports = class Auth {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} App App instance
 */
	constructor(App) {
		this.App = App;

		//Session template
		this._session = {
			"session_id": null,
			"user_id": null,
			"tokens": {}
		};

		//User template
		this._user = {
			"user_id": null,
			"history": [],
			"sessions": [],
			"context": null
		};

		//Users
		//Users can have many sessions
		this.users = [];

		//Sessions
		//Sessions belongs to a user
		this.sessions = [];

		//Strict mode
		//If the user did not handshake
    this.strict = Config.read('auth.strict');
	}


/**
 * Authenticate the user
 *
 * Based on the user_id from incoming we need to try and
 * match it to an existing session and then return a session
 * object. The session object is always returned but the
 * user might not be identified.
 *
 * @param {string} token Token generated from the client input
 * @param {Object} client Client instance, this directly interfaces with socket.io
 * @returns {Object} Session data
 */
	authenticate(token, client = null) {
		//Validate incoming token
		if(!this.validate_token(token)) {
			return false;
		}

		//Find an existing session with the incoming token
		let session_data = this.find_token(token);

		//If no user session record found then create one
		if(!session_data) {
			//Create a new session
			session_data = this.create();

			//Build session object and add the token
			//Session object is required so event handler can use it
			let session = new Session();
			session.load(session_data.session_id, session_data);
			session.add_token(token);

			//Event
			//@todo Move this to emit on the Auth object so no need to pass client into this object
			if(client) {
				this.App.Event.emit('auth.new', {
					session,
					client
				});
			}
		}
		
		return session_data;
	}


/**
 * Identify the user by their session_id
 *
 * @param {string} session_id Session id passed from request
 * @returns {Object} User and session objects including if the session was created adhoc
 */
	identify(session_id) {
		//Validate incoming token
		if(!this.validate_session_id(session_id)) {
			return false;
		}

		//
		let session_data = this.find_session(session_id);
		let created = false;

		//User cannot be identified
		//The session_id is invalid or the user didn't do a handshake
		if(!session_data) {
			//Strict mode is on so don't let them continue
			//This means they must authenticate first to generate a session
			if(this.strict) {
				return false;
			}

			//Create a session for them
			session_data = this.create(session_id);
			created = true;
		}

		//Session object
		let session = new Session();
		session.load(session_id, session_data);

		//User data
		let user_data = this.find_user(session_data.user_id);

		//User object
		let user = new User(this);
		user.load(user_data.user_id, user_data);
		
		return {
			user,
			session,
			created
		};
	}


/**
 * Validate token
 * 
 * @todo Add more validation here and document it
 * @param {string} token Token to validate
 * @returns {boolean}
 */
	validate_token(token) {
		if(!token) {
			return false;
		}

		return true;
	}


/**
 * Validate session id
 * 
 * @todo Add more validation here and document it
 * @param {string} session_id Session id to validate
 * @returns {boolean} If session id is valid
 */
	validate_session_id(session_id) {
		if(!session_id) {
			return false;
		}

		return true;
	}


/**
 * Create
 *
 * Creates auth session data
 * This does not create an object
 *
 * @param {string} session_id If a session_id is passed use that variable
 * @returns {Object} Session object
 */
	create(session_id = null) {
		//Generate random session id
		if(!session_id) {
			session_id = Randtoken.generate(16);
		}

		let session = JSON.parse(JSON.stringify(this._session));
		session.session_id = session_id;

		//Create user
		let user = JSON.parse(JSON.stringify(this._user));
		user.user_id = Randtoken.generate(16);
		user.sessions.push(session_id);
		this.users.push(user);

		//Save session with user
		session.user_id = user.user_id;
		this.sessions.push(session);

		return session;
	}


/**
 * Find user by token
 *
 * @param {string} token User token
 * @returns {*} Session object or false if failed to find the session
 */
	find_token(token) {
		for(var ii=0; ii < this.sessions.length; ii++) {
			if(_.has(this.sessions[ii].tokens, token)) {
				return this.sessions[ii];
			}
		}
		return false;
	}


/**
 * Find session by session id
 *
 * @param {string} session_id Session id from request
 * @returns {*} Session object or false if failed to find session by id
 */
	find_session(session_id) {
		for(var ii=0; ii < this.sessions.length; ii++) {
			if(this.sessions[ii].session_id === session_id) {
				return this.sessions[ii];
			}
		}
		return false;
	}


/**
 * Find user by user id
 *
 * @param {string} user_id User id
 * @returns {*} User object or false if failed to find the user by the id
 */
	find_user(user_id) {
		for(var ii=0; ii < this.users.length; ii++) {
			if(this.users[ii].user_id === user_id) {
				return this.users[ii];
			}
		}
		return false;
	}

}

