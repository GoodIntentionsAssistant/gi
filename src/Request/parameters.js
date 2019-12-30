/**
 * Parameters
 */
const Promise = require('promise');
const dotty = require("dotty");
const extend = require('extend');

module.exports = class Parameters {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Request instance
 */
	constructor(request) {
		//Promise is used because loading some entities might require live data
		this.promise = false;

		//Data of the parameters stored
		this.data = {};

		//Validates boolean is set depending what the intent wants
		this.validates = false;

		//Prompt message
		this.prompt = false;

		//List of entities loaded for this request to be parsed
		this.entities = {};

		//App
		this.app = request.app;

		//Request might be needed when loading in entities
		//Entities requiring live data will need API access / session
		this.request = request;

		//User
		this.user = this.request.user;
	}


/**
 * Value of a parameter
 * 
 * @param {string} key Parameter key
 * @returns {*}
 */
	value(key) {
		if(!this.data[key]) {
			return false;
		}
		return this.data[key].value;
	}


/**
 * Check if set
 *
 * The key might be set but it might not have a value
 * 
 * @param {string} key Parameter key
 * @returns {boolean}
 */
	has(key) {
		let val = this.value(key);
		if(!val) {
			return false;
		}
		return true;
	}

	
/**
 * Get the data matched of a key
 * 
 * @param {string} key Parameter key
 * @returns {*}
 */
	get(key) {
		if(!key) {
			return this.data;
		}

		return dotty.get(this.data, key);
	}

	
/**
 * Set parameter
 * 
 * @param {string} key Parameter key
 * @param hash value
 * @returns {*}
 */
	set(key, value) {
		let _default = {
			valid: true
		};
		let _data = [];

		if(typeof value === 'string') {
			_data['value'] = value;
			_data['string'] = value;
		}
		else {
			_data = extend(_default, value);
		}

		this.data[key] = _data;
	}


/**
 * Parse from intent
 *
 * @param string intent
 * @param object intent
 * @return void
 */
	parse_from_intent(string, intent) {
		//Intent has no parameters so get out of here
		if(!intent.parameters) {
			return true;
		}

		this.parse(string, intent.parameters);
	}


/**
 * Parse
 *
 * @param string intent
 * @param object intent
 * @return void
 */
	parse(string, data) {
		
		this.promise = new Promise((resolve, reject) => {
			//Load entities first
			var promises = [];
			for(var field in data) {
				//Dummy?
				if(data[field].data) {
					var entity = this.create_dummy_entity(data[field]);
					this.entities[field] = entity;
					data[field].entity = [field];
					continue;
				}

				//Check if entity is not an array
				var entities = data[field]['entity'];
				if(typeof entities == 'string') {
					entities = [ entities ];
				}

				//Loop each entity and make sure it's loaded
				for(var ii=0; ii<entities.length; ii++) {
					//Check if already loaded
					if(this.entities[entities[ii]]) {
						continue;
					}

					//Get entity
					var entity = this.app.EntityRegistry.get(entities[ii], this.request);

					if(entity) {
						//Add entity to this object so it can be used in _parse
						//Push promise from entity to check when it's fully loaded
						this.entities[entities[ii]] = entity;
						promises.push(this.entities[entities[ii]].promise);
					}
					else {
						//Entity defined not found so fatal error
						this.app.Log.error('Entity "'+data[field]['entity']+'" not found');
						reject();
					}
				}

			}

			//Parse
			if(promises.length === 0) {
				//Entities loaded already, no need to wait
				this._parse(string, data);
				resolve();
			}
			else {
				//Wait for all entities to load then parse
				Promise.all(promises).then(() => {
					this._parse(string, data);
					resolve();
				});
			}

		});
	}


/**
 * Parse
 *
 * @param string intent
 * @param object intent
 * @returns {boolean}
 */
	_parse(string, data) {
		//Output will be a hash of useful information which is sent to the intent
		var output = {};

		//Clean string
		string = string.toLowerCase();

		//Debugging vars
		//Set these if you want the user to have some slot filled data already
		//this.request.user.set('height', '190 cm');
		//this.request.user.set('weight', '79 kg');
		//this.user.set('dob_month', 'yes');
		//this.user.set('dob_day', 'yes');
		//this.user.set('favorite_city', 'Asia/Bangkok');

		//As we parse string we need to cut it down so we don't detect the same string again
		//If the input is "GBP to BAHT" and the entity finds GBP then the remaining will be
		//" to BAHT", then when we do the next loop the remaining will be " to ".
		var remaining = string;

		for(var field in data) {
			//Default data
			let _default = {
				keep: false,
				slotfill: false
			};
			data[field] = extend(_default, data[field]);
			data[field].field = field;

			this.request.log(`Parameter checking "${field}"`);

			//Prompt always uses slotfill so the answers can be remembered and it'll
			//go to the next prompt question or next action to call
			if(data[field].prompt) {
				data[field].slotfill = true;
			}

			//If using slotfill then turn keep on so the user session data is stored
			if(data[field].slotfill) {
				data[field].keep = true;
			}

			//Entities to array
			var entities = data[field]['entity'];
			if(typeof entities == 'string') {
				entities = [ entities ];
			}

			//Final result
			var result = null;

			//Remove remaining?
			var remove_remaining = true;

			//String to use
			//If the parameter wants to check the entire string
			var _string = remaining;
			if(data[field].full) {
				_string = string;
				remove_remaining = false;
			}

			//If this value was previously slotfilled
			let slotfill_result = false;
			if(data[field].slotfill) {
				slotfill_result = this._slotfill(field, data[field].slotfill);
			}

			//Try to parse the input with entities
			var entity = false;
			for(var ii=0; ii<entities.length; ii++) {
				entity = this.entities[entities[ii]];
				result = entity.parse(_string, data[field]);
				if(result.value) {
					break;
				}
			}

			//Required
			var required = data[field].required ? true : false;

			//Validation
			var valid = true;
			if(required) {
				valid = false;
			}

			//Check name was provided
			if(!data[field].name) {
				data[field].name = field;
			}

			//Add to output
			output[field] = {
				name: 			data[field].name,
				prompt: 		data[field].prompt,
				value: 			null,
				string: 		null,
				label: 			null,
				position:   null,
				slotfilled: false,
				slotfilled_previous: slotfill_result,
				data: 			{},
				entity,
				required,
				valid
			};

			//No result found in incoming text
			//Check for slotfilling if slotfilling is enabled on the parameter
			//The resultof the slotfill will be the entire parameter data, not just the value
			if(!result.value && slotfill_result) {
				result = slotfill_result;

				//Value was slot filled so no need to try and remove it from the incoming string
				remove_remaining = false;
				
				//So we know at output the value was slotfilled
				output[field].slotfilled = true;

				//Dont try to keep the data, don't need slotfill again
				data[field].keep = false;

				this.request.log(`Slotfilled, ${field} with "${slotfill_result.value}"`);
			}

			//Default value used if no value found
			//The default value should also be processed by the entity for example if the parameter
			//was for Date Entity setting the default to 'today' needs to be processed for the value
			//field to be entered.
			if(!result.value && data[field].default) {
				let _result = entity.parse(data[field].default.toString());
				if(_result) {
					result = _result;
				}
				else {
					result.value = data[field].default;
				}
			}

			//Prompt
			if(!result.value && data[field].prompt) {
				output[field].valid = false;
				output[field].required = true;
			}

			//If successful then 
			if(result && result.value) {
				output[field].valid = true;

				output[field].value 		= result.value;
				output[field].string 		= result.original;
				output[field].matched  	= result.matched;
				output[field].position  = result.position;

				//Change the intent action
				//@todo This needs to be documented, I can't remember where it's used
				if(data[field].action) {
					this._action(data[field], result);
				}

				//Keep / save result value to session user data
				if(data[field].keep && this.request) {
					this.keep(field, result);
				}

				//Pass all matched entity meta data
				if(result.data) {
					//If the parse method returned data then use that
					output[field].data = result.data;
				}
				else {
					//Otherwise fetch it from the entity data
					//@todo Add some error checking here
					output[field].data = entity.data[result.value];
				}

				//Labels are used when the Entity.data key is something useless like an id
				//so a label can be used to show a friendly name. For example the key for employee
				//data will be an integer, 55, but when we return back to the customer we want to
				//show the employees name like Bob.
				output[field].label = result.value;
				if(entity.data[result.value] && entity.data[result.value].label) {
					output[field].label = entity.data[result.value].label;
				}

				//Remove the original string from the next loop so we don't check it again
				//See above for the description of how this works
				if(result.original && remove_remaining) {
					remaining = remaining.replace(result.original,'');
				}
			}
		}

		//Prompt
		let has_prompt = this._check_prompt(output);

		//Validate
		//Only validate if there is no prompt action
		this.validates = true;
		if(!has_prompt) {
			this._validate(output);
		}

		//Set data
		for(var field in output) {
			this.set(field, output[field]);
		}

		return true;
	}


/**
 * Check for a prompt
 *
 * @param Object result
 * @returns {boolean}
 */
	_validate(parameters) {

		//If the parameter was required and it has no value then fail validation
		for (var field in parameters) {
			if(parameters[field].required && !parameters[field].value) {
				this.validates = false;
			}
		}

		return true;
	}


/**
 * Check for a prompt
 * 
 * Set prompt to the key of the parameter so the intent can load it back in and generate an expects
 *
 * @param Object result
 * @returns {boolean}
 */
	_check_prompt(parameters) {
		for(let field in parameters) {
			//If required and no value
			if(parameters[field].required && !parameters[field].value && parameters[field].prompt && !this.prompt) {
				this.prompt = field;
				return true;
			}
		}

		//No required prompt
		return false;
	}


/**
 * Keep slot filled parameter
 * 
 * @param string field
 * @param Object result
 * @returns {boolean}
 */
	keep(field, result) {
		this.request.user.set('parameter.'+field, result);
		return true;
	}


/**
 * Slotfill
 *
 * Fetch value from user session for the parameter if slotfill is enabled.
 *
 * First the field is checked
 * If options is an array (and not bool) each array key will be checked.
 *
 * @param field
 * @param mixed options
 * @returns {*} False for no match or string for the matched session result
 */
	_slotfill(field, options) {
		let _keys = [];

		//Add field to keys
		_keys.push(field);

		//If options is array
		if(options instanceof Array) {
			for(let ii=0; ii<options.length; ii++) {
				_keys.push(options[ii]);
			}
		}

		//Check each key
		for(let kk=0; kk<_keys.length; kk++) {
			if(this.request.user.has('parameter.'+_keys[kk])) {
				return this.request.user.get('parameter.'+_keys[kk]);
			}
		}

		return false
	}


/**
 * Action
 *
 * If a parameter was valid and an action key was set then we need to change
 * the intent action. The action can be passed as a string or passed as a hash
 * and the hash keys match the entity key.
 *
 * @param hash data
 * @param hash result
 * @returns {boolean}
 */
	_action(data, result) {
		//String
		if(typeof data.action == 'string') {
			this.request.action = data.action;
			return true;
		}

		//Otherwise it'll be a hash of result key and action
		if(!data.action[result.value]) {
			return false;
		}

		this.request.action = data.action[result.value];
		return true;
	}


/**
 * Create dummy entity
 *
 * @param string intent
 * @param object intent
 * @return hash parsed data and success
 */
	create_dummy_entity(parameter) {
		let entity = this.app.EntityRegistry.get('App.Basics.Entity.Dummy', {
			cache: false
		});

		//Check the dummy was found
		if(!entity) {
			this.app.Log.error('Basics/Dummy Entity for Parameters could not be found');
			return false;
		}

		entity.set_data(parameter.data);
		return entity;
	}

}

