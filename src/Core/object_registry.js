/**
 * Object Registry
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

module.exports = class ObjectRegistry {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor(app) {
    this.app = app;

    //Type of object
    this.type = null;

    //List of objects stored
    this.objects = [];
    
    //Promises for events when loaded
		this.promises = [];
    
    //Paths
		this.paths = [];
  }


/**
 * Load all
 *
 * @param string skill
 * @access public
 * @return object Promise
 */
  load_all(skill) {
    //Path to find entity and intents
    //The type is set from EntityRegistry and IntentRegistry
    let path = this.name_to_directory(skill+'.'+this.type);

    //Type, e.g. _entity, _intent
    let type_lower = this.type.toLowerCase();

    //Promise to make sure all files are loaded
    var promise = new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        var promises = [];

        //No files found in the skill directory
        //This isn't a critical fail but good to tell the user
        if(!files) {
          this.app.Log.error('Skill directory '+path+' is empty');
          resolve();
          return;
        }

        //Go through each of the files in the directory
        //The file name must match the type, e.g. dice_intent, dice_entity
        //Load the file, catch the promise
        files.forEach((file) => {
          //Ignore any files which might not be the right type
          if(file.indexOf('_'+type_lower+'.js') === -1) {
            return;
          }

          //Build up the object identifier and load it
          //Turning /Skill/Dice/Intent/dice_intent.js to App.Dice.Intent.Dice
          let identifier = file;
          identifier = identifier.replace('_'+type_lower+'.js','');
          identifier = _.camelize(identifier);
          identifier = skill+'.'+this.type+'.'+identifier;

          //Load the object and add promise to array
          let object = this.load(identifier);
          promises.push(object.promise);
        });

        //End of file loop
        //Check if all objects are loaded
        Promise.all(promises).then(function(){
          resolve();
        });

      });
    });

    return promise;
  }


/**
 * Load
 *
 * @param string name
 * @access public
 * @return void
 */
  load(name, options = {}) {
		//Options
		let _options = {
			cache: true
		};
		options = extend(_options, options);

    //Name not specified
    if(!name) {
      this.app.Log.error('Name not specified for '+this.type);
      return false;
    }

    //Skill not specified
    if(name.indexOf('.') === -1) {
      this.app.Log.error('Namespace identifier not specified for '+name);
      return false;
    }

    //Try to use cache
		if(options.cache && this.objects[name]) {
			return this.objects[name];
    }

    //Path based on incoming
    let path = this.name_to_directory(name);
    let filename = this.name_to_filename(name);

    let file = path+'/'+filename;

		return this._load(name, file, options);
  }


/**
 * Load object from file
 *
 * @param string file
 * @access public
 * @return void
 */
  _load(identifier, file, options) {
    //Options for loading entities
    let _options = {
      cache: true,
      pass: {}
    };
    options = extend(_options, options);

    //
    this.app.Log.add('Load '+this.type+' "'+identifier+'" ('+file+')');

    //App and file
    let Module = require(file);
    let object = new Module(this.app);

    //Set the identifier to the object which is used for caching the object
    //This identifier is also used for intent training
    object.identifier = identifier;

    //Cache
    if(options.cache) {
      this.objects[identifier] = object;
    }

    //Call back
    this.after_load(object);

    return object;
  }


/**
 * Get object
 *
 * @param string name
 * @access public
 * @return object
 */
  get(name) {
    if(!this.objects[name]) {
      this.app.Log.error(this.type+' '+name+' not found in objects');
      return false;
    }
    return this.objects[name];
  }


/**
 * Exists object
 *
 * @param string identifier
 * @access public
 * @return bool
 */
  exists(identifier) {
    if(!this.objects[identifier]) {
      return false;
    }
    return true;
  }


/**
 * Create an identifier for the name
 * 
 * This is used when loading objects from object cache and intent training
 * The scope, e.g. Sys. and App. must be removed.
 * 
 * Meaning System skills can be overwritten by 
 *
 * @param string name
 * @access public
 * @return string
 */
  identifier(name) {
    let parts = name.split('.');

    let type = parts[0];
    let skill = parts[1];

    let path = this.app.Path.get('skills.'+type.toLowerCase());
    path += '/'+skill;

    if(parts.length == 4) {
      path += '/'+parts[2];
    }

    return path;
  }


/**
 * Name to directory
 *
 * @param string name
 * @access public
 * @return string
 */
  name_to_directory(name) {
    let parts = name.split('.');

    let type = parts[0];
    let skill = parts[1];

    let path = this.app.Path.get('skills.'+type.toLowerCase());
    path += '/'+skill;

    if(parts.length == 4) {
      path += '/'+parts[2];
    }
    else if(parts.length == 3) {
      path += '/'+parts[2];
    }

    return path;
  }


/**
 * Name to file
 *
 * @param string name
 * @access public
 * @return string
 */
  name_to_filename(name) {
    let parts = name.split('.');

    let type  = parts[0];                 //App.
    let skill = parts[1];                 //Error.
    let filename  = parts.slice(-1)[0];   //NoAuth

		filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
    filename = filename.toLowerCase() + '_' + this.type.toLowerCase();

    return filename;
  }


}
