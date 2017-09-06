/**
 * Intents
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

module.exports = class IntentRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.objects = [];
		this.promises = [];
		this.app = app;
	}


/**
 * Load all
 *
 * @param string app
 * @access public
 * @return void
 */
	load_all(app) {
		var that = this;
		var directory = this.app.Path.get('app')+'/'+app+'/Intent';

		//
		var promise = new Promise(function(resolve, reject) {
			fs.readdir(directory, function(err, files) {
				var promises = [];

				if(!files) {
					resolve();
					return;
				}

				files.forEach(function(domain) {

					//Read domain directory
					var promise_domain = new Promise(function(resolve_domain, reject_domain) {
						
						fs.readdir(directory+'/'+domain, function(err, domain_files) {
							var promises_domains = [];

							if(!domain_files) {
								resolve_domain();
								return;
							}

							domain_files.forEach(function(intent_file) {
								//Ignore any files which might not be intents
								if(intent_file.indexOf('_intent.js') === -1) {
									return;
								}

								//Build up the intent name and load it
								var intent_name = intent_file;
								intent_name = intent_name.replace('_intent.js','');
								intent_name = _.camelize(intent_name);
								intent_name = app+'/'+intent_name;

								//Load the intent and add promise to array
								var intent = that.load(domain, intent_name);
								promises_domains.push(intent.promise);
							});


							//End of file loop
							//Check if all entities are loaded
							Promise.all(promises_domains).then(function(){
								resolve_domain();
							});

						});
					}); //End of promise domain

					promises.push(promise_domain);
				});

				//All domains loaded
				Promise.all(promises).then(function(){
					resolve();
				});

			});
		});


		this.promises.push(promise);
	}


/**
 * Load
 *
 * @param array name
 * @access public
 * @return void
 */
	load(domain, name, options) {
		//Options for loading intents
		let _options = {
			cache: true
		};
		options = extend(_options, options);

		//Name not specified
		if(!name) {
			this.app.error('Name not specified for intent '+name);
			return false;
		}

		//App not specified
		if(name.indexOf('/') === -1) {
			this.app.error('App not specified for intent '+name);
			return false;
		}

		//Try to use cache
		if(options.cache && this.objects[name]) {
			return this.objects[name];
		}

		//Build the filename if not set
		var app = name.substr(0,name.indexOf('/'));
		var filename = name.substr(name.indexOf('/')+1);
		filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
		filename = filename.toLowerCase()+'_intent';

		let file = this.app.Path.get('app')+'/'+app+'/Intent/'+domain+'/'+filename+'.js'

		return this._load(name, file, options);
	}


/**
 * Load intent from file
 *
 * @param string file
 * @access public
 * @return void
 */
	_load(name, file, options) {
		//Options for loading entities
		let _options = {
			cache: true,
			pass: {}
		};
		options = extend(_options, options);

		//
		this.app.log('Load Intent "'+name+'" ('+file+')');

		//App and file
		var Module = require(file);
		var intent = new Module(this.app);
		intent.setup();

		//Load the intent and pass options
		//The options might include request data which is used for session
		intent.load(name);

		//Cache
		if(options.cache) {
			this.objects[name] = intent;
		}

		//Train
		var that = this;
		intent.promise.then(function(result) {
			that._train(intent);
		});

		return intent;
	}


/**
 * Get intent
 *
 * @param string name
 * @access public
 * @return object
 */
	get(name) {
		if(!this.objects[name]) {
			this.app.error('Intent '+name+' not found in objects');
			return false;
		}
		return this.objects[name];
	}


/**
 * Train
 *
 * @param object intent
 * @access public
 * @return void
 */
	_train(intent) {
		//Train the keyword triggers set by the intent
		let keywords = intent.keywords();

		for(let tt=0; tt<keywords.length; tt++) {
			this.app.Train.train(keywords[tt].name, keywords[tt].keyword, keywords[tt].options);
		}
	}

}



