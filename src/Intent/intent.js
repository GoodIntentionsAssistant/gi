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
		
		this.parameters = [];

		this.classifier = 'default';
	}


/**
 * Load
 *
 * Initaliser has to call method this to setup the intent
 *
 * @return boolean
 */
	load() {
		//Load
		this.promise = new Promise((resolve, reject) => {
			//Call back to intent
			this.before_load();

			//Load in keywords and entities
			var keywords = this.load_keywords();
			var entities = this.load_entities();

			//Call back to intent
			this.after_load();

			Promise.all([keywords, entities]).then(function(){
				resolve();
			});
		});

		return true;
	}


/**
 * Load Keywords
 *
 * Intents can have a trigger word and synonyms and these words need to be
 * trained to the app so user input can be directed to the intent correctly.
 *
 * The code is supporting Promise but we don't use it. It might be useful
 * in the future if we need to do any special things.
 *
 * @access public
 * @return void
 */
	load_keywords() {
		return new Promise((resolve, reject) => {
			//Intent doesn't always need a trigger word for it to be fired
			//Some intents just use entity data and some have to be called directly
			if(this.trigger) {
				this.add_keyword(this.trigger, {});
			}

			if(this.synonyms) {
				if(this.synonyms instanceof Array) {
					//Add array list of synonyms with no options
					for(var ii=0; ii < this.synonyms.length; ii++) {
						this.add_keyword(this.synonyms[ii], {});
					}
				}
				else {
					//Add hash list of synonyms with options
					for(let key in this.synonyms) {
						this.add_keyword(key, this.synonyms[key]);
					}
				}
			}

			resolve();
		});
	}


/**
 * Train
 * 
 * @param hash data
 * @return bool
 */
	train(data) {
		for(var ii=0; ii < data.length; ii++) {
			let value = data[ii];
			this.add_keyword(data[ii], {});
		}

		return true;
	}


/**
 * Add Parameter
 * 
 * @param hash data
 * @return bool
 */
	add_parameter(name, data) {
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
			if(!this.entities) {
				resolve();
				return;
			}

			//Promises
			let promises = [];

			//Make sure all entities are loaded
			for(let key in this.entities) {
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

		for(var key in this.entities) {
			//Fetch the loaded entity grab the keywords
			var entity = this.app.EntityRegistry.get(key);
			var keywords = entity.get_data();
			var options = this.entities[key];

			//Loop the keywords and add to the intent
			for(var key in keywords) {
				//Might not want to index the key for the entity
				//@todo Remove this totally, never index the key
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
 */
	add_keyword(keyword, options) {
		let _options = {
			probability: 1,
			boost: 0,
			action: false,
			classifier: this.classifier
		};
		options = extend(_options, options);
		
		this._keywords.push({
			keyword: keyword,
			options: options
		});
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
		var that = this;

		return new Promise(function(resolve, reject) {
			var promise = that[request.action](request);
			var is_promise = (Promise.resolve(promise) == promise);
			
			if(is_promise) {
				promise.then(function(result) {
					resolve(result);
				});
			}
			else {
				//Method does not need promise so return directly
				resolve(promise);
			}

		});
	}


	before_load() {
	}

	after_load() {
	}

}
