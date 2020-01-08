/**
 * Intent
 */
const extend = require('extend');
const Promise = require('promise');

module.exports = class Intent {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		this.app = app;

		this.input = null;
		this.session = null;
		
		this._keywords 	= [];			//Trained keywords
		this._entities  = [];			//Entities required
		this._explicits = [];			//Matches that are a must or reject
		
		this.parameters = {};

		this.collection = 'default';
	}


/**
 * Load
 *
 * Initaliser has to call method this to setup the intent
 *
 * @returns {boolean} If loaded
 */
	load() {
		//Load
		this.promise = new Promise((resolve, reject) => {
			//Call back to intent
			this.before_load();

			//Load entities required for this intent
			let entities = this.load_entities();

			//Call back to intent
			this.after_load();

			Promise.all([entities]).then(function(){
				resolve();
			});
		});

		return true;
	}


/**
 * Train
 * 
 * @param {*} data String or an array of the data to train
 * @param {Object} options Training options
 * @returns {boolean} Successfully trained
 */
	train(data, options = {}) {
		//Data could be a string, change it to an array
		if(typeof data === 'string') {
			data = [data];
		}

		//Loop through data array
		for(var ii=0; ii < data.length; ii++) {
			if(typeof data[ii] === 'string' && data[ii].substr(0,1) === '@') {
				//Train with entity data
				this.add_entity(data[ii].substr(1), options);
			}
			else {
				//Train normal word
				this.add_keyword(data[ii], options);
			}
		}

		return true;
	}


/**
 * Must haves
 * 
 * @param {*} data Data to add
 * @param {Object} options Options for training explicit
 * @returns {boolean} Success
 */
	must(data, options = {}) {
		return this.add_explicit('must', data, options);
	}


/**
 * Reject
 *
 * @param {*} data Data to add
 * @param {Object} options Options for training explicit
 * @returns {boolean} Success
 */
  reject(data, options = {}) {
		return this.add_explicit('reject', data, options);
  }


/**
 * Explicit
 *
 * Either the intent MUST have or REJECT
 * This will be loaded in with intent_registry
 *
 * @param {string} type Reject or Must
 * @param {string} keyword Keyword to add
 * @param {Object} options Options for adding explicit
 * @returns {boolean} Success of adding
 */
  add_explicit(type, keyword, options = {}) {
		if(typeof keyword === 'object') {
			//Passed as an array
			for(let ii=0; ii < keyword.length; ii++) {
				this._explicits.push({
					identifier: this.identifier,
					keyword: keyword[ii],
					type,
					options
				});
			}
		}
		else {
			//Passed as a single string, e.g. .reject('add')
			this._explicits.push({
				identifier: this.identifier,
				keyword,
				type,
				options
			});
		}

		return true;
  }


/**
 * Add Entity
 *
 * Entities are added to a list and when ready each entity is loaded in
 * and then trained using the add_keyword method
 * 
 * @param {string} name Entity name
 * @param {Object} options Options for adding entity
 * @returns {boolean} Success of adding
 */
	add_entity(name, options = {}) {
		this._entities[name] = options;
		return true;
	}


/**
 * Add Parameter
 * 
 * @param {string} name Entity name
 * @param {Object} options Options for adding parameter
 * @returns {boolean} Success of adding
 */
	parameter(name, data) {
		this.parameters[name] = data;
		return true;
	}


/**
 * Has parameters
 * 
 * @todo This return looks wrong, should it be a boolean?
 * @returns {number} Length of parameters
 */
	has_parameters() {
		return Object.keys(this.parameters).length;
	}


/**
 * Load Entities
 *
 * Check if the intent has entities it requires and load them in
 * First it will load all the entities in then it'll load up the keywords.
 * Loading the entities needs to be done via a promise because the entity
 * data might be loaded in from a remote source.
 *
 * @todo This needs cleaning up, it turned into a bit of a mess
 * @param {string} name Name of entity
 * @returns {boolean} Success
 */
	load_entities(name) {
		return new Promise((resolve, reject) => {
			//No entities to train from
			if(!this._entities) {
				resolve();
				return;
			}

			//Promises
			let promises = [];

			//Make sure all entities are loaded
			for(let key in this._entities) {
				let entity = this.app.EntityRegistry.get(key);
				if(!entity.loaded) {
					promises.push(entity.promise);
				}
			}

			//Wait for all promises to finish then train
			if(promises.length > 0) {
				Promise.all(promises).then(() => {
					this._train_from_entities();
					resolve();
				});
			}
			else {
				//Entities already loaded, no need to wait for training
				this._train_from_entities();
				resolve();
			}

		});

		return true;
	}


/**
 * Train from entities
 *
 * @returns {boolean} Success of training
 */
	_train_from_entities() {

		for(let key in this._entities) {
			//Fetch the loaded entity grab the keywords
			let entity = this.app.EntityRegistry.get(key);
			let keywords = entity.get_data();
			let options = this._entities[key];

			//Loop the keywords and add to the intent
			for(let key in keywords) {
				//Might not want to index the key for the entity
				if(!entity.ignore_index_key) {
					this.add_keyword(key, options);
				}

				//Add synonyms
				if(keywords[key].synonyms) {
					for(let ii=0; ii < keywords[key].synonyms.length; ii++) {
						this.add_keyword(keywords[key].synonyms[ii], options);
					}
				}
			}
		}

		return true;
	}


/**
 * Add Keyword
 *
 * @param {*} keywords Keywords for training
 * @param {Object} options Options
 * @returns {boolean}
 */
	add_keyword(keyword, options) {
		let _options = {
			probability: 1,
			boost: 0,
			action: false,
			collection: this.collection
		};
		options = extend(_options, options);

		//If the keyword is a regular expression then change the collection to be strict
		//e.g. this.train([new RegExp(/^(\d+)?d((\d+)([+-]\d+)?)?$/,'g')]);
		if(keyword instanceof RegExp) {
			options.collection = 'strict';
		}

		this._keywords.push({
			keyword,
			options
		});

		return true;
	}


/**
 * Get auth
 *
 * @todo Is this used?
 * @returns {boolean} If can get auth
 */
	get_auth() {
		if(this.auth) {
			return this.auth;
		}

		return false;
	}


/**
 * Return keywords for intent
 *
 * @todo Is the loop required? Could that not be moved to add_keyword?
 * @returns {string[]} List of keywords
 */
	keywords() {
		let output = [];

		for(let ii=0; ii< this._keywords.length; ii++) {
			output.push(extend(
				{ identifier: this.identifier },
				this._keywords[ii]
			));
		}

		return output;
	}


/**
 * Explicits
 *
 * Loaded in from intent registry
 *
 * @returns {string[]} Explicits array
 */
	explicits() {
		return this._explicits;
	}


/**
 * Fire the intent
 *
 * Call the method for this intent.
 * 
 * @param {Object} request Request incoming
 * @returns {boolean} Always true
 */
	fire(request) {
		this.before_request(request);

		return new Promise((resolve, reject) => {
			var promise = this[request.action](request);
			var is_promise = (Promise.resolve(promise) === promise);
			
			if(is_promise) {
				promise.then((result) => {
					this.after_request(request);
					resolve(result);
				});
			}
			else if(promise !== false) {
				//Method does not need promise so return directly
				//If false was returned then the intent must finish the request manually
				//using request.end();
				this.after_request(request);
				resolve(promise);
			}

		});

		return true;
	}


/**
 * Prompt
 * 
 * @todo Document this method, not clear where it's used
 * @param {Object} request Request instance
 * @returns {string} Prompt ext
 */
	prompt(request) {
		let prompt_key = request.parameters.prompt;
		let prompt = this.parameters[prompt_key];

		request.expect({
			key: prompt_key,
			force: true,
			entity: prompt.entity,
			keep: true
    });

		return prompt.prompt;
	}


/**
 * Before request
 * 
 * @param {Object} request Request instance
 * @returns {boolean} Success
 */
	before_request(request) {
		return true;
	}


/**
 * After request
 * 
 * @param {Object} request Request instance
 * @returns {boolean} Success
 */
	after_request(request) {
		return true;
	}


/**
 * Shutdown callback
 * 
 * @returns {boolean} Success
 */
  shutdown() {
		return true;
  }


/**
 * Before load callback
 * 
 * @returns {boolean} Success
 */
	before_load() {
		return true;
	}


/**
 * After load callback
 * 
 * @returns {boolean} Success
 */
	after_load() {
		return true;
	}

}
