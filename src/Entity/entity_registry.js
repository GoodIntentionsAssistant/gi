/**
 * Entities
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

module.exports = class EntityRegistry {

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
		var directory = this.app.Path.get('app')+'/'+app+'/Entity/';

		//
		var promise = new Promise(function(resolve, reject) {
			fs.readdir(directory, function(err, files) {
				var promises = [];

				if(!files) {
					that.app.error('App directory '+directory+' is empty');
					resolve();
					return;
				}

				files.forEach(function(file) {
					//Ignore any files which might not be intents
					if(file.indexOf('_entity.js') === -1) {
						return;
					}

					//Build up the intent name and load it
					var entity_name = file;
					entity_name = entity_name.replace('_entity.js','');
					entity_name = _.camelize(entity_name);
					entity_name = app+'/'+entity_name;

					//Load the entity and add promise to array
					var entity = that.load(entity_name);
					promises.push(entity.promise);
				});

				//End of file loop
				//Check if all entities are loaded
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
 * @param string name
 * @param hash options
 * @access public
 * @return object
 */
	load(name, options) {
		//Options for loading entities
		let _options = {
			cache: true
		};
		options = extend(_options, options);

		//Try to use cache
		if(options.cache && this.objects[name]) {
			return this.objects[name];
		}

		//App not specified
		if(name.indexOf('/') === -1) {
			this.app.error('App not specified for entity '+name);
			return false;
		}

		//Build the filename if not set
		let app = name.substr(0,name.indexOf('/'));
		let filename = name.substr(name.indexOf('/')+1);
		filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
		filename = filename.toLowerCase()+'_entity';

		let file = this.app.Path.get('app')+'/'+app+'/Entity/'+filename+'.js'

		return this._load(name, file, options);
	}


/**
 * Load
 *
 */
	_load(name, file, options) {
		//Options for loading entities
		let _options = {
			cache: true,
			pass: {}
		};
		options = extend(_options, options);

		//
		this.app.log('Load Entity "'+name+'" ('+file+')');

		//App and file
		let Module = require(file);
		let entity = Module();
		entity.initialize(this.app);

		//Load the entity and pass options
		//The options might include request data which is used for session
		entity.load(options.pass);

		//Cache
		if(options.cache) {
			this.objects[name] = entity;
		}

		return entity;
	}


/**
 * Get entity
 * 
 * @access public
 * @param string name
 * @param object request optional
 * @return object
 */
	get(name, request) {
		var entity = this.objects[name];

		//No entity is loaded
		//Entities must always be preloaded using load() before get
		if(!entity) {
			this.app.error('Entity '+name+' has not been loaded');
			return false;
		}

		//Entity requires session so it can load live data
		//Live data could be something like employee names or project titles.
		if(entity.require_session) {
			//Request object is needed
			if(!request) {
				this.app.error('Entity get '+name+' called but no request object passed');
				return false;
			}

			//Auth required is the name of the API, e.g. devi
			var auth_required = entity.require_session;

			//Check they are authorized
			if(!request.session.authorized(auth_required)) {
				this.app.error('Entity get '+name+' called but user is not authorized');
				return false;
			}

			//Filename
			var app = name.substr(0,name.indexOf('/'));
			var filename = name.substr(name.indexOf('/')+1);
			filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
			filename = filename.toLowerCase()+'_entity';

			var file = this.app.Path.get('app')+'/'+app+'/Entity/'+filename+'.js'

			//Build up a unique ident for this session and token
			//If the api token is not defined
			var session_auth_ident = request.session.auth_ident(auth_required);
			name = name+'::'+session_auth_ident;

			//If the session based Entity exists
			if(this.objects[name]) {
				return this.objects[name];
			}

			//Load the session based entity
			//We will set `pass` which is sent to Entity::load so the entity
			//knows it needs to load the data. If this is not defined it won't load any data
			return this._load(name, file, {
				pass: {
					request: request
				}
			});
		}

		return entity;
	}

}




