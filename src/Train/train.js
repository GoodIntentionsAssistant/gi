/**
 * Train
 */
const Config = girequire('/src/Config/config');

module.exports = class Train {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		this.collections = {};
		this.app = app;
	}


/**
 * Add classifier to collection
 *
 * @param {string} name Collection name
 * @param {string} type Collection type
 * @returns {boolean} If adding the collection was successful
 */
	add_collection(name, type) {
    let file = type+'_classifier.js';
		let filename = Config.path('system')+'/Train/Classifier/'+file;

		var Classifier;

    try {
      Classifier = require(filename);
    }
    catch(error) {
			throw new Error(`Failed to load "${type}" classifier`, { error:error });
    }

		//Create collection
		this.collections[name] = new Classifier();

		return true;
	}


/**
 * Has collection
 *
 * @param {string} name Collection name
 * @returns {boolean} If the collection exists
 */
	has_collection(name) {
		return this.collections[name] ? true : false;
	}


/**
 * Train
 *
 * @param {string} intent Intent where the training is from
 * @param {string} keyword Keywords and expressions
 * @param {Object} options Options for training
 * @returns {boolean} If the collection was successfully trained
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
			throw new Error(`Failed to load collection "${collection}" because it has no specified classifer in config`);
		}

		//Check collection exists
		if(!this.has_collection(collection)) {
			this.add_collection(collection, classifier);
		}

		//Clean up
		if(typeof keyword === 'string') {
			keyword = keyword.toLowerCase();
		}

		//Add to the collection
		this.collections[collection].train(intent, keyword);

		return true;
	}


/**
 * Find
 *
 * @todo Fatal error throwing, no need to return false
 * @param {Object} utterance Utterance object from user including the text
 * @param {string} collection Collection to check
 * @returns {*} Either false if it failed to fetch the collection or the find result
 */
	find(utterance, collection) {
		//Default collection if not set
		if(!collection) {
			collection = 'default';
		}

		//Check collection exists
		if(!this.collections[collection]) {
			throw new Error(`Failed to load the collection "${collection}"`);
		}

		//Result
		return this.collections[collection].find(utterance);
	}


/**
 * Untrain
 *
 * Goes through all loaded classifiers and removes trained data for the identifier
 *
 * @param {string} identifier Identifier/intent to remove
 * @returns {boolean}
 */
  untrain(identifier) {
    //Go through each collection loaded and untrain for the identifier
    for(var collection in this.collections) {
      this.collections[collection].untrain(identifier);
    }

    return true;
  }

}

