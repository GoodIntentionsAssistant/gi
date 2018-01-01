/**
 * Expecting
 */

module.exports = class Expecting {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(request) {
		this.request = request;
		this.redirect = false;
		this.expecting = null;
	}


/**
 * Has
 *
 * @access public
 * @return boolean
 */
	has() {
		return this.request.session.has_expecting();
	}


/**
 * Load
 *
 * @param object request
 * @access public
 * @return void
 */
	load(request) {
		//Get the expecting settings for this request
		this.expecting = this.request.session.get_expecting();

		//Inputted text
		this.input = this.request.input.text;

		//Quit commands to get out of expecting
		//@todo Expand on this to scan for text in the input better
		//@todo Break this reset into a new method and document it
		if(this.input == 'quit' || this.input == 'stop') {
			this.request.session.reset_expecting();
			return;
		}

		//Check if we need to update the intent and action
		if(this.expecting.force) {
			this.redirect = true;
		}

		//Check the results on entity data
		if(this.expecting.entity) {
			this._check_entity_input();
		}

		//Need to check
		if(this.redirect) {
			//Set the intent action
			if(this.expecting.action) {
				this._action(this.expecting.action, this.input);
			}

			//Save their response
			if(this.expecting.save_answer) {
				this._save_answer(this.expecting.save_answer, this.input);
			}

			//Change the intent
			this.request.intent = this.request.app.IntentRegistry.get(this.expecting.intent);

			//Save this 
			this.request.session.set('last_expecting',this.expecting)
		}

		//Reset expecting so we don't double call it
		this.request.session.reset_expecting();
	}


/**
 * Check entity input
 *
 * @param object request
 * @access public
 * @return void
 */
	set(data) {
		data.intent = this.request.intent;
		this.request.session.set_expecting(data);
	}


/**
 * Check entity input
 *
 * @access public
 * @return void
 */
	_check_entity_input() {
		var entity = this.request.app.EntityRegistry.get(this.expecting.entity);
		var parsed = entity.parse(this.input);

		if(parsed.value) {
			this.input = parsed.value;
			this.redirect = true;

			//Parameter key for storing the result
			//It will have a default unless save_answer has been set
			let parameter_key = 'expects';
			if(this.expecting.save_answer) {
				parameter_key = this.expecting.save_answer;
			}
			this.request.parameters.set(parameter_key, parsed.value);
		}
		else if(this.expecting.force) {
			//Expecting was forced but nothing was parsed

			//@todo Work out what the idea of this was, it doesn't always work
			let _last = this.request.session.data('last_expecting');
			if(_last) {
				this.expecting = _last;
			}

			if(this.expecting) {
				this.expecting.save_answer = false;
			}

			if(this.expecting.fail) {
				this.expecting.action = this.expecting.fail;
			}

			this.redirect = true;
		}

	}


/**
 * Save session data
 *
 * @param object request
 * @access public
 * @return void
 */
	_save_answer(key, value) {
		this.request.session.user(key, value);
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
		if(!expecting[this.input]) {
			return false;
		}

		this.request.action = expecting[this.input];
		return true;
	}

}



