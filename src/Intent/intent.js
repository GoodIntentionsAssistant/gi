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
 * @return void
 */
	constructor(app) {
		this.app = app;

		this.input = null;
		this.session = null;
		
		this._keywords = [];
		this._entities = [];
		this._tests = [];
		
		this.parameters = [];

		this.classifier = 'default';
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
 * @param string name
 * @param hash options
 * @return bool
 */
	add_entity(name, options = {}) {
		this._entities[name] = options;
		return true;
	}


/**
 * Add Parameter
 * 
 * @param hash data
 * @return bool
 */
	parameter(name, data) {
		this.parameters[name] = data;
		return true;
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
 * @param array keywords
 * @param array options
 */
	_train_from_entities() {

		for(var key in this._entities) {
			//Fetch the loaded entity grab the keywords
			var entity = this.app.EntityRegistry.get(key);
			var keywords = entity.get_data();
			var options = this._entities[key];

			//Loop the keywords and add to the intent
			for(var key in keywords) {
				//Might not want to index the key for the entity
				if(!entity.ignore_index_key) {
					this.add_keyword(key, options);
				}

				//Add synonyms
				if(keywords[key].synonyms) {
					for(var ii=0; ii < keywords[key].synonyms.length; ii++) {
						this.add_keyword(keywords[key].synonyms[ii], options);
					}
				}
			}
		}
	}


/**
 * Add Keyword
 *
 * @param array keywords
 * @param array options
 * @access public
 * @return bool
 */
	add_keyword(keyword, options) {
		let _options = {
			probability: 1,
			boost: 0,
			action: false,
			classifier: this.classifier
		};
		options = extend(_options, options);

		//If the keyword is a regular expression then change the collection to be strict
		//e.g. this.train([new RegExp(/^(\d+)?d((\d+)([+-]\d+)?)?$/,'g')]);
		if(keyword instanceof RegExp) {
			options.classifier = 'strict';
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
 * Return intents
 *
 * After the intents are loaded they are added to an array
 * which can then be passed back so training can start 
 */
	keywords() {
		var output = [];

		for(var ii=0; ii< this._keywords.length; ii++) {
			output.push(extend(
				{ identifier: this.identifier },
				this._keywords[ii]
			));
		}

		return output;
	}


/**
 * Fire the intent
 *
 * Call the method for this intent and build up return data
 * 
 * @param hash input
 * @return hash
 */
	fire(request) {
		return new Promise((resolve, reject) => {
			var promise = this[request.action](request);
			var is_promise = (Promise.resolve(promise) == promise);
			
			if(is_promise) {
				promise.then(function(result) {
					resolve(result);
				});
			}
			else if(promise !== false) {
				//Method does not need promise so return directly
				//If false was returned then the intent must finish the request manually
				//using request.end();
				resolve(promise);
			}

		});
	}


/**
 * Before load callback
 * 
 * @return mixed
 */
	before_load() {
	}


/**
 * After load callback
 * 
 * @return mixed
 */
	after_load() {
	}

}
