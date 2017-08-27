/**
 * Learn
 */
const extend = require('extend');
const Scrubber = require('../src/Utilities/scrubber');

var Learn = function() {
	this.classifiers = {};
}


/**
 * Initialize
 *
 * @param object app
 * @access public
 * @return void
 */
Learn.prototype.initialize = function(app) {
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
Learn.prototype.add_classifier = function(name, type) {
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
Learn.prototype.has_classifier = function(name) {
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
Learn.prototype.train = function(intent, keyword, options) {
	//Classifier group
	var group = 'main';
	if(options && options.classifier) {
		group = options.classifier;
	}

	//Classifier type
	var type = this.app.config.classifiers[group].classifier;

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
	keyword = keyword.toLowerCase();

	//Add to the classifer
	for(var ii=0; ii<repeat; ii++) {
		this.classifiers[group].train(intent, keyword);
	}

	return true;
}


/**
 * Scrub
 *
 * @param string str
 * @access public
 * @return object
 */
Learn.prototype.scrub = function(str) {

	//Contractions
	//@todo Improve this and move to a module
	//http://www.enchantedlearning.com/grammar/contractions/list.shtml
	var contractions = [
		["what's", "what is"],
		["i'm","i am"],
		["you're","you are"],
		["it's","it is"],
		["we're","we are"],
		["they're","they are"],
		["that's","that is"],
		["who's","who is"],
		["what's","what is"],
		["where's","where is"],
		["when's","when is"],
		["why's","why is"],
		["how's","how is"],
	];
	for(var ii=0; ii<contractions.length; ii++) {
		var regex = new RegExp(contractions[ii][0], "gi");
		str = str.replace(contractions[ii][0],contractions[ii][1]);
	}

	//Remove stop words
	//@todo Improve this and move to a module
	var stopwords = [
		' a ',
		' an ',
		' in ',
		' the ',
		' is ',
		' it ',
		' of ',
		',',
		'\\.',
		'\\!',
		'\\?'
	];
	for(var ii=0; ii<stopwords.length; ii++) {
		var regex = new RegExp(stopwords[ii], "gi");
		str = str.replace(regex,' ');
	}

	//Trim
	str = str.trim();

	return str;
}


/**
 * Find
 *
 * @param string str To search for
 * @return object
 */
Learn.prototype.find = function(str, classifier) {
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

	return this.classifiers[classifier].find(str);
}


/**
 * Status
 *
 * @access public
 * @return hash
 */
Learn.prototype.status = function() {
	var data = {
		'classifiers_count': Object.keys(this.classifiers).length
	};
	return data;
}



module.exports = Learn;



