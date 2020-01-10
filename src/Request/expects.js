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
 * @returns {*} False if the data does not exist or an object of the stored expected
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
 * @returns {boolean} If the session has expecting
 */
	has() {
		this.check_expiry();
		return this.request.session.has('expecting');
	}


/**
 * Reset expecting
 *
 * @returns {boolean} Success of removing the session data
 */
	reset() {
		return this.request.session.remove('expecting');
	}


/**
 * Check if expecting has expired
 *
 * @returns {boolean} Success of checking the expiry of an active expected
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
 * @param {*} settings Expecting settings or pass empty for expecting any type of reply
 * @returns {boolean} Success of setting the expected
 */
	set(settings = {}) {
		//Default
		let _settings = {
			expire: this.expire_default			//Default seconds to keep the expected for
		};
		settings = extend(_settings, settings);

		//Set expiry
		settings.expire_at = moment().add(settings.expire, 'seconds');

		//Set the intent to be the request intent name
		settings.intent = this.request.intent.identifier;

		//Set the session to expect
		//The next call from this user will read this in and check the user input
		this.request.session.set('expecting', settings);

		//Expecting response log
		Logger.info(`Expecting a response to "${settings.intent}"`, { prefix: this.request.ident });

		//Expect a reply attachment
		this.request.attachment('reply');

		return true;
	}


/**
 * Check the request
 * 
 * When the rest is made, typically just for request messages before the text is checked
 * the method will check to see if an expected key exists in the session data from a previous
 * request.
 * 
 * This method should only be called if there is something in expected already chcking with the ::has method
 *
 * @todo Clean this code up, return bool
 * @returns {boolean} Success of checking the request
 */
	check() {
    Logger.info('Checking expects', { prefix:this.request.ident });

		//Get the expecting settings for this request
		this.expecting = this.get();

		//Cancel commands to get out of expecting
		//Using Understand and the cancel classifier to check if
		//the user is trying to cancel the current expects.
		//Cancel Entity and Intent are within the basics skill.
		//@todo Move this to request
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

		//Parameter key used for keeping the value on the user session
		if(!this.expecting.key) {
			this.expecting.key = 'expects';
		}

		//Utterance test from user
		this.text = this.request.utterance.text();

		//Check the results on entity data
		this._check_entity_input();

		//Need to check
		if(this.redirect) {
			//Set the intent action
			if(this.expecting.action) {
				this._set_intent_action(this.expecting.action);
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
 * @returns {boolean} Success of getting the entity data
 */
	_check_entity_input() {
		//Fetch the entity so the input can be parsed
		//The entity might be specified in the expect attribute or
		//it might be set in the data attribute. If it's data then a
		//dummy entity is created.
		let entity = this.get_entity();

		//No data to compare and check the new user input on
		//This means the expected was probably set with no entity or data
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
		}
		else if(this.expecting.force) {
			//String match not found when parsing

			//Forced to expect an answer
			this.expecting.action = 'response';
			this.expecting.keep = false;

			//When expects fails check if the action should be changed
			//This is useful to show the user an error message
			if(this.expecting.fail) {
				this.expecting.action = this.expecting.fail;
			}

			this.redirect = true;
			this.finish = false;
		}
		else {
			//No incoming match found and the expected was not forced
			//So no need to try and handle the response
			this.finish = true;
		}

		return true;
	}


/**
 * Get entity
 *
 * @returns {Object} Entity instance
 */
	get_entity() {
		//Expecting not set
		if(!this.expecting) {
			throw new Error('Expected data not set');
		}

		//No entity or data specified in the expects from intent
		//This means it'll just call back to the same intent
		if(!this.expecting.entity && !this.expecting.data) {
			return false;
		}

		//Entity is set in expecting
		if(this.expecting.entity) {
			return this.request.app.EntityRegistry.get(this.expecting.entity);
		}

		//Load from data
		let entity = this.app.EntityRegistry.get('Sys.Entity.Dummy', {
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
 * @returns {boolean} Success of setting
 */
	_keep(key, value) {
		return this.request.user.set(key, value);
	}


/**
 * Set Intent Action
 * 
 * Set the request action
 *
 * @param {string} action Action for the class
 * @returns {boolean} Success of changing the action to be called on intent
 */
	_set_intent_action(action) {
		this.request.action = action;
		return true;
	}

}



