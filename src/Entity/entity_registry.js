/**
 * Entity Registry
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class EntityRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.type = 'Entity';
	}


/**
 * After load
 *
 * @access public
 * @return void
 */
  after_load(entity) {
		//Setup entity
		entity.setup();

		//Load the entity
		entity.load();
	}



/**
 * Get entity
 * 
 * @access public
 * @param string identifier
 * @param object options optional
 * @return object
 */
	get(identifier, options = {}) {
		//Options
		let _options = {
			cache: true
		};
		options = extend(_options, options);

		//If the object doesn't exist already or caching if off
    if(!this.objects[identifier] || options.cache === false) {
			let entity = this.load(identifier, options);
			return entity;
		}
		
		let entity = this.objects[identifier];
		return entity;

		//@todo Entities loading in session data in needs to be checked again
		//Entity requires session so it can load live data
		//Live data could be something like employee names or project titles.
		/*if(entity.require_session) {
			//Request object is needed
			if(!request) {
				this.app.Log.error('Entity get '+name+' called but no request object passed');
				return false;
			}

			//Auth required is the name of the API, e.g. devi
			var auth_required = entity.require_session;

			//Check they are authorized
			if(!request.session.authorized(auth_required)) {
				this.app.Log.error('Entity get '+name+' called but user is not authorized');
				return false;
			}

			//Filename
			var app = name.substr(0,name.indexOf('/'));
			var filename = name.substr(name.indexOf('/')+1);
			filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
			filename = filename.toLowerCase()+'_entity';

			var file = this.app.Path.get('skills')+'/'+app+'/Entity/'+filename+'.js'

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
		}*/

		return entity;
	}

}




