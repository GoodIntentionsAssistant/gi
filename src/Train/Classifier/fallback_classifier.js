/**
 * Fallback Classifier
 */
const Classifier = require('./classifier.js');
const Classify = require('../Vendor/classify.js');

module.exports = class ClassifyClassifier extends Classifier {

/**
 * Constructor
 *
 * @constructor
 */
	constructor() {
		super();
		this.Classify = new Classify();
	}


/**
 * Train
 *
 * @param {string} intent Intent identifier
 * @param {string} keyword Keyword for the intent
 * @returns {boolean} Success of adding
 */
	train(intent, keyword) {	
		this.Classify.train(intent, keyword);
		return true;
	}


/**
 * Untrain
 *
 * @param {string} intent Intent identifier to remove
 * @returns {boolean} Success of removing intent
 */
	untrain(intent) {
		this.Classify.untrain(intent);
		return true;
	}


/**
 * Find
 *
 * @param {Object} utterance Utterance object
 * @returns {*} Classifier result or false if nothing found
 */
	find(utterance) {
		let str = utterance.scrubbed();
		let result = this.Classify.rank(str);

		if(result.groups.length === 0) {
			return false;
		}

		if(result.certainty <= 0.2) {
			return false;
		}

		return [{
			confidence: result.certainty,
			result: result.groups[0].group
		}];
	}

}