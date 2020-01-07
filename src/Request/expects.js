/**
 * Expects
 */
const extend = require('extend');
const moment = require('moment');

const Config = girequire('/src/Config/config');
const Logger = girequire('/src/Helpers/logger');

module.exports = class Expects {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Request instance
 */
	constructor(request) {
		this.request 		= request;
		this.app       	= request.app;

		this.redirect 	= false;
		this.finish     = false;
		this.expecting 	= null;

		this.expire_default = Config.read('expects.expire');
	}


/**
 * Get expecting data
 *
 * @returns {boolean}
 */
	get() {
		this.check_expiry();
		let result = this.request.session.get('expecting');
		return result ? result : false;
	}


/**
 * Has
 *
 * Check if the previous call had something expected.
 *
 * @returns {boolean}
 */
	has() {
		this.check_expiry();
		return this.request.session.has('expecting');
	}


/**
 * Reset expecting
 *
 * @returns {boolean}
 */
	reset() {
		return this.request.session.remove('expecting');
	}


/**
 * Check if expecting has expired
 *
 * @returns {boolean}
 */
	check_expiry() {
		//Check if the expects has expired
		let result = this.request.session.get('expecting');

		if(!result) {
			return false;
		}

		if(result.expire_at && moment().isAfter(result.expire_at)) {
			this.reset();
			return true;
		}

		return false;
	}


/**
 * Set expecting
 *
 * @param {Object} data Expecting settings
 * @returns {boolean}
 */
	set(data) {
		//Default
		let _data = {
			expire: this.expire_default
		};
		data = extend(_data, data);

		//If the data is a string convert it to a string
		if(typeof data === 'string' && data === 'reply') {
			this.request.attachment('reply');
			return true;
		}

		//Set expiry
		data.expire_at = moment().add(data.expire, 'seconds');

		//Set the intent to be the request intent name
		data.intent = this.request.intent.identifier;

		//Set the session to expect
		//The next call from this user will read this in and check the user input
		this.request.session.set('expecting', data);

		//Expecting response log
		Logger.info(`Expecting a response to "${data.intent}"`, { prefix: this.request.ident });

		//Expect a reply attachment
		this.request.attachment('reply');

		return true;
	}


/**
 * Check the request
 *
 * @todo Clean this code up, return bool
 * @param {Object} request Request object
 * @returns {boolean}
 */
	check(request) {
    Logger.info('Checking expects', { prefix:this.request.ident });

		//Get the expecting settings for this request
		this.expecting = this.get();

		//Inputted text
		this.text = this.request.input.text;

		//Cancel commands to get out of expecting
		//Using Understand and the cancel classifier to check if
		//the user is trying to cancel the current expects.
		//Cancel Entity and Intent are within the common skill.
		let cancel = this.app.Understand.process(this.request.utterance, ['cancel']);
		if(cancel.success) {
			this.reset();
			this.request.intent 		= cancel.matches[0].intent;
			this.request.collection = cancel.matches[0].collection;
			this.request.confidence = cancel.matches[0].confidence;
			return true;
		}

		//Check if we need to update the intent and action
		if(this.expecting.force) {
			this.redirect = true;
		}

		//Parameter key
		if(!this.expecting.key) {
			this.expecting.key = 'expects';
		}

		//Check the results on entity data
		this._check_entity_input();

		//Need to check
		if(this.redirect) {
			//Set the intent action
			if(this.expecting.action) {
				this._action(this.expecting.action, this.text);
			}

			//Save their response
			if(this.expecting.keep) {
				this._keep(this.expecting.key, this.text);
			}

			//Change the intent
			this.request.intent = this.request.app.IntentRegistry.get(this.expecting.intent);
		}

		//Reset expecting so we don't double call it
		//If the expects has been forced and it failed then do not reset
		if(this.finish) {
			this.reset();
		}

		return true;
	}


/**
 * Check entity input
 *
 * @returns {boolean}
 */
	_check_entity_input() {
		//Fetch the entity so the input can be parsed
		//The entity might be specified in the expect attribute or
		//it might be set in the data attribute. If it's data then a
		//dummy entity is created.
		let entity = this.get_entity();

		//Maybe no entity set so return out of here
		//@todo Check this, I don't think it's going to check all other conditions like redirect
		if(!entity) {
			this.finish = true;
			return false;
		}

		//Parse the user input on the entity
		let parsed = entity.parse(this.text);

		if(parsed.value) {
			this.text = parsed.value;
			this.redirect = true;
			this.finish = true;
			this.request.parameters.set(this.expecting.key, parsed.value);

			Logger.info(`Expects value found, "${parsed.value}", stored parameter key "${this.expecting.key}"`, { prefix:this.request.ident });

			//Reset last_expecting
			this.request.session.remove('last_expecting');
		}
		else if(!this.expecting.force) {
			//Reply is not forced
			this.finish = true;
		}
		else if(this.expecting.force) {
			//Expecting was forced but nothing was parsed
			//Fetch the last expecting that triggered this expecting
			let _last = this.request.session.get('last_expecting');
			if(_last) {
				this.expecting = _last;
			}

			//Make sure the answer is not saved
			if(this.expecting) {
				this.expecting.keep = false;
			}

			//When expects fails check if the action should be changed
			//This is useful to show the user an error message
			if(this.expecting.fail) {
				this.expecting.action = this.expecting.fail;
			}
			else {
				//Failed to get forced input, redirect them back to response
				this.expecting.action = 'response';
			}

			this.redirect = true;
			this.finish = false;
		}

		return true;
	}


/**
 * Get entity
 *
 * @todo Check registry get and move to config
 * @returns {Object}
 */
	get_entity() {
		//No entity or data
		if(!this.expecting.entity && !this.expecting.data) {
			return false;
		}

		//Entity is set in expecting
		if(this.expecting.entity) {
			return this.request.app.EntityRegistry.get(this.expecting.entity);
		}

		//Load from data
		let entity = this.app.EntityRegistry.get('App.Basics.Entity.Dummy', {
			cache: false
		});
		entity.set_data(this.expecting.data);

		return entity;
	}


/**
 * Keep the value on the user session
 *
 * @param {string} key Key
 * @param {string} value Value of the key
 * @returns {boolean}
 */
	_keep(key, value) {
		return this.request.user.set(key, value);
	}


/**
 * Action
 *
 * @todo Check if result param is needed
 * @param {*} expecting Expecting
 * @param {string} result Text result
 * @returns {boolean}
 */
	_action(expecting, result = '') {
		//String
		if(typeof expecting === 'string') {
			this.request.action = expecting;
			return true;
		}

		//Otherwise it'll be a object of result key and action
		if(!expecting[this.text]) {
			return false;
		}

		this.request.action = expecting[this.text];
		return true;
	}

}



