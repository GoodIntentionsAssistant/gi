/**
 * Train
 */
const Config = girequire('src/Config/config');

module.exports = class Train {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.collections = {};
		this.app = app;
	}


/**
 * Add classifier to collection
 *
 * @param string name
 * @param string type
 * @access public
 * @return boolean
 */
	add_collection(name, type) {
    let file = type+'_classifier.js';
		let filename = Config.path('system')+'/Train/Classifier/'+file;

    try {
      var Classifier = require(filename);
    }
    catch(error) {
      this.app.Error.fatal([
        'Failed to load '+type+' classifier',
        'Make sure you have created '+file,
        error.message,
        error.stack
      ]);
    }

		//Create collection
		this.collections[name] = new Classifier();

		return true;
	}


/**
 * Has collection
 *
 * @param string name
 * @access public
 * @return boolean
 */
	has_collection(name) {
		return this.collections[name] ? true : false;
	}


/**
 * Train
 *
 * @param string intent
 * @param string keyword
 * @param hash options
 * @return boolean
 */
	train(intent, keyword, options) {
		//Collection
		var collection = 'default';
		if(options && options.collection) {
			collection = options.collection;
		}

		//Collection classifier
    var classifier = null;
    if(options && options.classifier) {
      //Use classifier defined in options
      classifier = options.classifier;
    }
    else {
      //Load the classifier from config file
			classifier = Config.read('collections.'+collection+'.classifier');
    }

		//If no classifier defined for the collection then fatal error
		//Each collection must have a defined classifier
		if(!classifier) {
      this.app.Error.fatal([
        'Collection "'+collection+'" has no specified classifer',
        'Check your config file and make sure the collection has a classifier defined'
      ]);
		}

		//Priority
		let priority = 1;
		if(options && options.priority > 0) {
			priority = options.priority;
		}

		//Check collection exists
		if(!this.has_collection(collection)) {
			this.add_collection(collection, classifier);
		}

		//Clean up
		if(typeof keyword == 'string') {
			keyword = keyword.toLowerCase();
		}

		//Add to the collection
		this.collections[collection].train(intent, keyword);

		return true;
	}


/**
 * Find
 *
 * @param object utterance
 * @param string collection
 * @access public
 * @return object
 */
	find(utterance, collection) {
		//Default collection if not set
		if(!collection) {
			collection = 'default';
		}

		//Check collection exists
		if(!this.collections[collection]) {
      this.app.Error.fatal([
        'Failed to call the collection "'+collection+'"',
        'It does not look like it has been loaded in or there is a problem in the collection'
      ]);
			return false;
		}

		//Result
		return this.collections[collection].find(utterance);
	}


/**
 * Untrain
 *
 * Goes through all loaded classifiers and removes trained data for the identifier
 *
 * @param string identifier
 * @access public
 * @return bool
 */
  untrain(identifier) {
    //Go through each collection loaded and untrain for the identifier
    for(var collection in this.collections) {
      this.collections[collection].untrain(identifier);
    }

    return true;
  }

}

