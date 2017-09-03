/**
 * Learn
 */
const extend = require('extend');
const Scrubber = require('../src/Utility/scrubber');

module.exports = class Learn {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.classifiers = {};
		this.app = app;
	}


/**
 * Add classifier
 *
 * @param string name
 * @param string type
 * @access public
 * @return boolean
 */
	add_classifier(name, type) {
		var Classifier = require('../src/Classifier/'+type+'_classifier.js');

		//
		var _classifier = new Classifier();
		_classifier.initialize();

		this.classifiers[name] = _classifier;

		return true;
	}


/**
 * Has classifier
 *
 * @param string name
 * @access public
 * @return boolean
 */
	has_classifier(name) {
		return this.classifiers[name] ? true : false;
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
		//Classifier group
		var group = 'main';
		if(options && options.classifier) {
			group = options.classifier;
		}

		//Classifier type
		var type = this.app.Config.read('classifiers.'+group+'.classifier');

		//For boosting
		var repeat = 1;
		if(options && options.boost > 0) {
			repeat = (options.boost * 10);
		}

		//Check classifier exists
		if(!this.has_classifier(group)) {
			this.add_classifier(group, type);
		}

		//Clean up
		if(typeof keyword == 'string') {
			keyword = keyword.toLowerCase();
		}

		//Add to the classifer
		for(var ii=0; ii<repeat; ii++) {
			this.classifiers[group].train(intent, keyword);
		}

		return true;
	}


/**
 * Find
 *
 * @param string str To search for
 * @return object
 */
	find(str, classifier) {
		//Default classifier if not set
		if(!classifier) {
			classifier = 'main';
		}

		//Check classifier exists
		if(!this.classifiers[classifier]) {
			return false;
		}

		//Scrub the incoming string
		str = Scrubber.lower(str);
		str = Scrubber.contractions(str);
		str = Scrubber.stop_words(str);
		str = Scrubber.grammar(str);

		//Result
		return this.classifiers[classifier].find(str);
	}


/**
 * Status
 *
 * @access public
 * @return hash
 */
	status() {
		var data = {
			'classifiers_count': Object.keys(this.classifiers).length
		};
		return data;
	}

}

