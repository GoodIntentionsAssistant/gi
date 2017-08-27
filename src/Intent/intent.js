// intent.js
const extend = require('extend');
const Promise = require('promise');

function Intent() {
	var input = null;
	var session = null;
	var _keywords = [];
	var _entities = [];

/**
 * Initialize
 *
 * Setup the module
 *
 * @param object app
 * @return void
 */
	function initialize(app) {
		this.app = app;
	}


/**
 * Load
 *
 * Initaliser has to call method this to setup the intent
 *
 * @return boolean
 */
	function load(name) {
		var that = this;

		this.name = name;

		//Load
		this.promise = new Promise(function(resolve, reject) {
			//Call back to intent
			that.before_load();

			//Load in keywords and entities
			var keywords = that.load_keywords();
			var entities = that.load_entities();

			//Call back to intent
			that.after_load();

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
	function load_keywords() {
		var that = this;

		return new Promise(function(resolve, reject) {
			//Intent doesn't always need a trigger word for it to be fired
			//Some intents just use entity data and some have to be called directly
			if(that.trigger) {
				that.add_keyword(that.trigger, {});
			}

			if(that.synonyms) {
				for(var ii=0; ii < that.synonyms.length; ii++) {
					that.add_keyword(that.synonyms[ii], {});
				}
			}

			resolve();
		});
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
	function load_entities(name) {
		var that = this;

		return new Promise(function(resolve, reject) {
			if(!that.entities) {
				resolve();
				return;
			}

			//Loop through the list of entities we need to train
			for(var key in that.entities) {
				//Fetch the loaded entity grab the keywords
				var entity = that.app.Entities.get(key);
				var keywords = entity.get_data();

				//Loop the keywords and add to the intent
				for(var key in keywords) {
					//Might not want to index the key for the entity
					//@todo Remove this totally, never index the key
					if(!entity.ignore_index_key) {
						that.add_keyword(key, {});
					}

					//Add synonyms
					if(keywords[key].synonyms) {
						for(var ii=0; ii < keywords[key].synonyms.length; ii++) {
							that.add_keyword(keywords[key].synonyms[ii], {});
						}
					}
				}

			}

			resolve();
		});

	}


/**
 * Add Intent
 *
 * Add the intent to the intent array
 * It is possible to add two intents per module but I don't think
 * we'll need that at the moment.
 *
 * @param array keywords
 * @param array options
 */
	function add_keyword(keyword, options) {
		_options = {
			probability: 1,
			boost: 0,
			action: false
		}
		options = extend(_options,options);

		_keywords.push({
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
	function get_auth() {
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
	function keywords() {
		var output = [];

		for(var ii=0; ii< _keywords.length; ii++) {
			output.push(extend(
				{ name: this.name },
				_keywords[ii]
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
	function fire(request) {
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


	function before_load() {
	}

	function after_load() {
	}


	return {
		initialize: initialize,

		fire: fire,
		load: load,

		load_keywords: load_keywords,
		load_entities: load_entities,
		get_auth: get_auth,

		before_load: before_load,
		after_load: after_load,

		add_keyword: add_keyword,
		keywords: keywords
	}
}

module.exports = Intent

/*
component

triggers

actions*/