/**
 * Intent
 */
const extend = require('extend');
const Promise = require('promise');

module.exports = class Intent {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.app = app;

		this.input = null;
		this.session = null;
		
		this._keywords 	= [];			//Trained keywords
		this._entities  = [];			//Entities required
		this._explicits = [];			//Matches that are a must or reject

		this._tests 		= [];
		
		this.parameters = {};

		this.collection = 'default';
	}


/**
 * Load
 *
 * Initaliser has to call method this to setup the intent
 *
 * @access public
 * @return bool
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
 * @param array data
 * @param hash options
 * @return bool
 */
	train(data, options = {}) {
		for(var ii=0; ii < data.length; ii++) {
			if(typeof data[ii] == 'string' && data[ii].substr(0,1) == '@') {
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
 * @param mixed data
 * @param hash options
 * @return bool
 */
	must(data, options = {}) {
  	return this.add_explicit('must', data, options);
	}


/**
 * Reject
 *
 * @param mixed data
 * @param hash options
 * @return bool
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
 * @param string type Reject or Must
 * @param mixed data
 * @param hash options
 * @return bool
 */
  add_explicit(type, data, options = {}) {
  	if(typeof data == 'object') {
  		//Passed as an array
			for(var ii=0; ii < data.length; ii++) {
	  		this._explicits.push({
	  			type: type,
	  			identifier: this.identifier,
					keyword: data[ii],
					options: options
	  		});
			}
  	}
  	else {
  		//Passed as a single string, e.g. .reject('add')
  		this._explicits.push({
	  		type: type,
	  		identifier: this.identifier,
				keyword: data,
				options: options
  		});
  	}

		return true;
  }


/**
 * Add Tests
 * 
 * @param hash data
 * @access public
 * @return bool
 */
	tests(data, options = {}) {
		for(let ii=0; ii < data.length; ii++) {
			this._tests.push(data);
		}
		return true;
	}


/**
 * Add Entity
 *
 * Entities are added to a list and when ready each entity is loaded in
 * and then trained using the add_keyword method
 * 
 * @param string name
 * @param hash options
 * @access public
 * @return bool
 */
	add_entity(name, options = {}) {
		this._entities[name] = options;
		return true;
	}


/**
 * Add Parameter
 * 
 * @param string name
 * @param hash data
 * @access public
 * @return bool
 */
	parameter(name, data) {
		this.parameters[name] = data;
		return true;
	}


/**
 * Has parameters
 * 
 * @access public
 * @return bool
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
 * @param string name
 * @return void
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

	}


/**
 * Train from entities
 *
 * @access public
 * @return void
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
	}


/**
 * Add Keyword
 *
 * @param string keywords
 * @param hash options
 * @access public
 * @return bool
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
			keyword: keyword,
			options: options
		});

		return true;
	}


/**
 * Get auth
 *
 * @access public
 * @return string
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
 * @access public
 * @return array
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
 * @access public
 * @return array
 */
	explicits() {
		return this._explicits;
	}


/**
 * Fire the intent
 *
 * Call the method for this intent.
 * 
 * 
 * @param hash request
 * @access public
 * @return Promise
 */
	fire(request) {
		this.before_request(request);

		return new Promise((resolve, reject) => {
			var promise = this[request.action](request);
			var is_promise = (Promise.resolve(promise) == promise);
			
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
	}


/**
 * Before request
 * 
 * @param object request
 * @access public
 * @return void
 */
	before_request(request) {
	}


/**
 * After request
 * 
 * @param object request
 * @access public
 * @return void
 */
	after_request(request) {
	}


/**
 * Before load callback
 * 
 * @param object request
 * @access public
 * @return void
 */
	before_load() {
	}


/**
 * After load callback
 * 
 * @param object request
 * @access public
 * @return void
 */
	after_load() {
	}

}
