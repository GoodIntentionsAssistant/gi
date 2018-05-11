/**
 * Expects
 */

module.exports = class Expects {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(request) {
		this.request 		= request;
		this.app       	= request.app;
		this.redirect 	= false;
		this.finish     = false;
		this.expecting 	= null;
	}


/**
 * Get expecting data
 *
 * @access public
 * @return boolean
 */
	get() {
		let result = this.request.session.data('expecting');
		return result ? result : false;
	}


/**
 * Has
 *
 * Check if the previous call had something expected.
 *
 * @access public
 * @return boolean
 */
	has() {
		return this.request.session.has('expecting');
	}


/**
 * Reset expecting
 *
 * @access public
 * @return boolean
 */
	reset() {
		return this.request.session.remove('expecting');
	}


/**
 * Set expecting
 *
 * @param hash expecting
 * @access public
 * @return void
 */
	set(data) {
		//If the data is a string convert it to a string
		if(typeof data === 'string' && data === 'reply') {
			this.request.attachment('reply');
			return;
		}

		//Set the intent to be the request intent name
		data.intent = this.request.intent.identifier;

		//Set the session to expect
		//The next call from this user will read this in and check the user input
		this.request.session.set('expecting',data);

		//Expecting response log
		this.request.log('Expecting a response to "'+data.intent+'"');

		//Expect a reply attachment
		this.request.attachment('reply');
	}


/**
 * Load
 *
 * @todo Clean this code up, return bool
 * @param object request
 * @access public
 * @return bool
 */
	check(request) {
    request.log('Checking expects');

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
			if(this.expecting.save_answer) {
				this._save_answer(this.expecting.key, this.text);
			}

			//Change the intent
			this.request.intent = this.request.app.IntentRegistry.get(this.expecting.intent);
		}

		//Reset expecting so we don't double call it
		//If the expects has been forced and it failed then do not reset
		if(this.finish) {
			this.reset();
		}
	}


/**
 * Check entity input
 *
 * @access public
 * @return void
 */
	_check_entity_input() {
		//Fetch the entity so the input can be parsed
		//The entity might be specified in the expect attribute or
		//it might be set in the data attribute. If it's data then a
		//dummy entity is created.
		let entity = this.get_entity();

		//Maybe no entity set so return out of here
		if(!entity) {
			return false;
		}

		//Parse the user input on the entity
		let parsed = entity.parse(this.text);

		if(parsed.value) {
			this.text = parsed.value;
			this.redirect = true;
			this.finish = true;
			this.request.parameters.set(this.expecting.key, parsed.value);

			//Reset last_expecting
			this.request.session.remove('last_expecting');
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
				this.expecting.save_answer = false;
			}

			//When expects fails check if the action should be changed
			//This is useful to show the user an error message
			if(this.expecting.fail) {
				this.expecting.action = this.expecting.fail;
			}

			this.redirect = true;
			this.finish = false;
		}

	}


/**
 * Get entity
 *
 * @access public
 * @return object
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
		let entity = this.app.EntityRegistry.get('App.Common.Entity.Dummy', {
			cache: false
		});
		entity.set_data(this.expecting.data);

		return entity;
	}


/**
 * Save session data
 *
 * @param object request
 * @access public
 * @return void
 */
	_save_answer(key, value) {
		this.request.user.set(key, value);
	}


/**
 * Action
 *
 * @param object request
 * @access public
 * @return void
 */
	_action(expecting, result) {
		//String
		if(typeof expecting == 'string') {
			this.request.action = expecting;
			return true;
		}

		//Otherwise it'll be a hash of result key and action
		if(!expecting[this.text]) {
			return false;
		}

		this.request.action = expecting[this.text];
		return true;
	}

}



