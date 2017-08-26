/**
 * Expecting
 *
 * Might seem overkill to have a new file for this but it will expand over time as
 * we add more complexity. This module will probably tie closer in with session.
 */
var Expecting = function() {
	this.request = null;
	this.redirect = false;
	this.expecting = null;
}


/**
 * Initialize
 *
 * @param object response
 * @access public
 * @return void
 */
Expecting.prototype.initialize = function(request) {
	this.request = request;
}


/**
 * Has
 *
 * @access public
 * @return boolean
 */
Expecting.prototype.has = function() {
	return this.request.session.has_expecting();
}


/**
 * Load
 *
 * @param object request
 * @access public
 * @return void
 */
Expecting.prototype.load = function(request) {
	//Get the expecting settings for this request
	this.expecting = this.request.session.get_expecting();

	//Inputted text
	this.input = this.request.input.text;

	//Quit commands to get out of expecting
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
		this.request.intent = this.request.app.Intents.get(this.expecting.intent);

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
Expecting.prototype.set = function(data) {
	data.intent = this.request.intent;
	this.request.session.set_expecting(data);
}


/**
 * Check entity input
 *
 * @param object request
 * @access public
 * @return void
 */
Expecting.prototype._check_entity_input = function() {
	var entity = this.request.app.Entities.get(this.expecting.entity);
	var parsed = entity.parse(this.input);

	if(parsed.value) {
		this.input = parsed.value;
		this.redirect = true;
	}
	else if(this.expecting.force) {
		this.expecting = this.request.session.data('last_expecting');
		this.expecting.save_answer = false;
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
Expecting.prototype._save_answer = function(data, result) {
	this.request.session.set(data.key, {
		name: data.name,
		result: result
	});
}


/**
 * Action
 *
 * @param object request
 * @access public
 * @return void
 */
Expecting.prototype._action = function(expecting, result) {
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


module.exports = Expecting;


