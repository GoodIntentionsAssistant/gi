/**
 * Train
 */
const extend = require('extend');
const Scrubber = require('../Utility/scrubber');

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
		let filename = this.app.Path.get('system')+'/Train/Classifier/'+type+'_classifier.js';

    try {
      var Classifier = require(filename);
    }
    catch(e) {
      this.app.Error.fatal([
        'Failed to load '+type+' classifier',
        'Make sure you have created '+file
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
		if(options && options.classifier) {
			collection = options.classifier;
		}

		//Classifier type
		var type = this.app.Config.read('classifiers.'+collection+'.classifier');

		//Priority
		let priority = 1;
		if(options && options.priority > 0) {
			priority = options.priority;
		}

		//Check classifier exists
		if(!this.has_collection(collection)) {
			this.add_collection(collection, type);
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
 * @param string str To search for
 * @return object
 */
	find(str, collection) {
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

		//Scrub the incoming string
		str = Scrubber.lower(str);
		str = Scrubber.contractions(str);
		str = Scrubber.grammar(str);

		//Result
		return this.collections[collection].find(str);
	}


/**
 * Status
 *
 * @access public
 * @return hash
 */
	status() {
		var data = {
			'collections_count': Object.keys(this.collections).length
		};
		return data;
	}

}

