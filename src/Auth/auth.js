/**
 * Auth
 *
 * A user has many sessions
 */
const Config = require('../Config/config.js');

const User = require('./user.js');
const Session = require('./session.js');

const _ = require('underscore');
const Randtoken = require('rand-token');

module.exports = class Auth {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.app = app;

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
 * @param string token Token generated from the user
 * @param object client object
 * @return string session_id
 */
	authenticate(token, client) {
		let session_data = this.find_token(token);

		//If no user session record found then create one
		if(!session_data) {
			//Create a new session
			session_data = this.create();

			//Build session object and add the token
			//Session object is required so event handler can use it
			let session = new Session(this);
			session.load(session_data.session_id, session_data);
			session.add_token(token);

			//Event
			this.app.Event.emit('auth.new', {
				session: session,
				client: client
			});
		}
		
		return session_data;
	}


/**
 * Identify the user by their session_id
 *
 * @param string session_id
 * @return hash user and session objects
 */
	identify(session_id) {
		let session_data = this.find_session(session_id);

		//User cannot be identified
		//The session_id is invalid or the user didn't do a handshake
		if(!session_data) {
			//Strict mode is on so don't let them continue
			if(this.strict) {
				return false;
			}

			//Create a session for them
			session_data = this.create(session_id);
		}

		//Session object
		let session = new Session(this);
		session.load(session_id, session_data);

		//User data
		let user_data = this.find_user(session_data.user_id);

		//User object
		let user = new User(this);
		user.load(user_data.user_id, user_data);
		
		return {
			user: user,
			session: session
		};
	}


/**
 * Create
 *
 * Creates auth session data
 * This does not create an object
 *
 * @param string session_id Optional
 * @access public
 * @return session_id
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
 * @param string token
 * @access public
 * @return mixed hash or boolean
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
 * @param string session_id
 * @access public
 * @return mixed hash or boolean
 */
	find_session(session_id) {
		for(var ii=0; ii < this.sessions.length; ii++) {
			if(this.sessions[ii].session_id == session_id) {
				return this.sessions[ii];
			}
		}
		return false;
	}


/**
 * Find user by user id
 *
 * @param string user_id
 * @access public
 * @return mixed hash or boolean
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

