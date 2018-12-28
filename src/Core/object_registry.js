/**
 * Object Registry
 */
const Identifier = require('../Core/identifier');

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
  load_all(skill, options = {}) {
    //Path to find entity and intents
    //The type is set from EntityRegistry and IntentRegistry
    let path = Identifier.to_directory(skill+'.'+this.type);

    //Type, e.g. _entity, _intent
    let type_lower = this.type.toLowerCase();

    //Promise to make sure all files are loaded
    var promise = new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        var promises = [];

        //No files found in the skill directory
        //This isn't a critical fail but good to tell the user
        if(!files) {
          //this.app.Log.error('Skill directory '+path+' is empty');
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
          let name = file;
          name = name.replace('_'+type_lower+'.js','');
          name = _.camelize(name);

          //Check if this should be loaded from options
          if(typeof options['only'] != 'undefined') {
            //The current file is not in the options for which files to only load in
            //So loading this object will be skipped
            if(options['only'].indexOf(name) === -1) {
              return;
            }
          }

          //Build an identifier
          let identifier = skill+'.'+this.type+'.'+name;

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

    //
    let file = Identifier.to_file(name);
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
    this.app.Log.add(this.type + ' ' + identifier + ' Loading');

    //Try to find the real path
    //file = fs.realpathSync(file + '.js');
    //file = file.replace(/\.js$/, '');

    //App and file
    try {
      var Module = require(file);
    }
    catch(e) {
      console.log(e);
      this.app.Error.fatal([
        'Failed to load '+identifier,
        'Make sure you have created '+file
      ]);
    }

    //Create the new module
    //If the file does not have an exported module it'll error
    try {
      var object = new Module(this.app);
    }
    catch(error) {
      this.app.Error.fatal(['Failed to load', this.type, error.message, error.stack]);
    }

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
 * Remove
 *
 * @param string identifier
 * @access public
 * @return bool
 */
  remove(identifier) {
    let object = this.get(identifier);

    //Object by the identifier name could not be found
    //Maybe it was never loaded in or was removed already
    if(!object) {
      return false;
    }

    //Call shutdown method call back
    object.shutdown();

    //Remove from objects
    delete this.objects[identifier];

    return true;
  }


/**
 * Get object
 *
 * @param string name
 * @access public
 * @return object
 */
  get(name) {
    let identifier = this.find(name);

    if(!identifier) {
      this.app.Log.error(this.type+' '+identifier+' not found in objects');
      return false;
    }
    
    return this.objects[identifier];
  }


/**
 * Find an object by name
 *
 * The name could come through as the full identifier path or just the name
 * Such as App.Example.Attachment.Navigation or just navigation
 *
 * @param string name
 * @access public
 * @return string
 */
  find(name) {
    let identifier = null;
    let split = name.split('.');

    if(split.length == 1) {
      //Passed as just the name and not full identifier
      for(let key in this.objects) {
        //App.Example.Attachment.Navigation => navigation
        let _name = key.split('.').splice(-1,1)[0].toLowerCase();
        if(_name == name) {
          identifier = key;
          continue;
        }
      }
    }
    else {
      identifier = name;
    }

    return identifier;
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
 * After load
 *
 * @access public
 * @return void
 */
  after_load() {
  }


/**
 * Before load
 *
 * @access public
 * @return void
 */
  before_load() {
  }

}
