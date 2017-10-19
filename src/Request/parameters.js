/**
 * Parameters
 */
const Promise = require('promise');
const Scrubber = require('../../src/Utility/scrubber');
const dotty = require("dotty");
const extend = require('extend');

module.exports = class Parameters {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(request) {
		//Promise is used because loading some entities might require live data
		this.promise = false;

		//Data of the parameters stored
		this.data = {};

		//Validates boolean is set depending what the intent wants
		this.validates = false;

		//List of entities loaded for this request to be parsed
		this.entities = {};

		//App
		this.app = request.app;

		//Request might be needed when loading in entities
		//Entities requiring live data will need API access / session
		this.request = request;
	}


/**
 * Value of a parameter
 * 
 * @param string key
 * @access public
 * @return mixed
 */
	value(key) {
		if(!this.data[key]) {
			return false;
		}
		return this.data[key].value;
	}

	
/**
 * Get the data matched of a key
 * 
 * @param string key
 * @access public
 * @return mixed
 */
	get(key) {
		return dotty.get(this.data, key);
	}

	
/**
 * Set parameter
 * 
 * @param string key
 * @param hash value
 * @access public
 * @return mixed
 */
	set(key, value) {
		let _default = {
			valid: true
		};
		let _data = [];

		if(typeof value == 'string') {
			_data['value'] = value;
			_data['string'] = value;
		}
		else {
			_data = extend(_options, value);
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
		var that = this;

		this.promise = new Promise(function(resolve, reject) {
			//Load entities first
			var promises = [];
			for(var field in data) {
				//Dummy?
				if(data[field].data) {
					var entity = that.create_dummy_entity(data[field]);
					that.entities[field] = entity;
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
					if(that.entities[entities[ii]]) {
						continue;
					}

					//Get entity
					var entity = that.app.EntityRegistry.get(entities[ii], that.request);

					if(entity) {
						//Add entity to this object so it can be used in _parse
						//Push promise from entity to check when it's fully loaded
						that.entities[entities[ii]] = entity;
						promises.push(that.entities[entities[ii]].promise);
					}
					else {
						//Entity defined not found so fatal error
						that.app.Log.error('Entity "'+data[field]['entity']+'" not found');
						reject();
					}
				}

			}

			//Parse
			if(promises.length == 0) {
				//Entities loaded already, no need to wait
				that._parse(string, data);
				resolve();
			}
			else {
				//Wait for all entities to load then parse
				Promise.all(promises).then(function(){
					that._parse(string, data);
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
 * @access private
 * @return boolean
 */
	_parse(string, data) {
		//Output will be a hash of useful information which is sent to the intent
		var output = {};

		//Clean string
		string = Scrubber.lower(string);

		//As we parse string we need to cut it down so we don't detect the same string again
		//If the input is "GBP to BAHT" and the entity finds GBP then the remaining will be
		//" to BAHT", then when we do the next loop the remaining will be " to ".
		var remaining = string;

		for(var field in data) {
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

			//Try to parse the input with entities
			for(var ii=0; ii<entities.length; ii++) {
				var entity = this.entities[entities[ii]];
				result = entity.parse(_string);
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
				console.error('Your parameter "'+field+'" was missing a name');
				process.exit();
			}

			//Add to output
			output[field] = {
				name: data[field].name,
				value: null,
				string: null,
				label: null,
				entity: entity,
				required: required,
				valid: valid
			}

			//No result:
			//Load from session user data
			if(!result.value && data[field].slotfill) {
				result.value = this.request.session.user(field);
			}

			//No result
			//Default
			if(!result.value && data[field].default) {
				result.value = data[field].default;
			}

			//If successful then 
			if(result && result.value) {
				output[field].value = result.value;
				output[field].string = result.original;
				output[field].valid = true;
				output[field].matched  = result.matched;

				//Change the intent action
				if(data[field].action) {
					this._action(data[field], result);
				}

				//Save to session user data
				if(this.request) {
					this.request.session.user(field, result.value);
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

		//Success based on required
		this.validates = true;
		for(var field in output) {
			if(output[field].required && !output[field].value) {
				this.validates = false;
			}
		}

		//Set data
		for(var field in output) {
			this.set(field, output[field]);
		}

		return true;
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
 * @access private
 * @return boolean
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
		var entity = this.app.EntityRegistry.get('Sys.Common.Entity.Dummy', {
			cache: false
		});

		//Check the dummy was found
		if(!entity) {
			this.app.Log.error('Common/Dummy Entity for Parameters could not be found');
			return false;
		}

		entity.data = parameter.data;
		return entity;
	}

}

