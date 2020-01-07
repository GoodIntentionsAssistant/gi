/**
 * Classify NLP Classifier
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
		//Get the scrubbed text, excluding stop words
		let str = utterance.scrubbed('stopwords');

		//If the scrubbed input is short we'll use a lesser scrubbed string
		//"how old are you?" can be scrubbed down to "old" if all stop words are removed
		//This doesn't give the NLP engine much to work with
		if(str.length <= 4) {
			str = utterance.scrubbed();
		}

		//Rank the results
		let result = this.Classify.rank(str, true);

		if(result.groups.length === 0) {
			return false;
		}

		//if(result.certainty <= 0.2) {
		//	return false;
		//}

		//Build up standardised result
		let output = [];

		for(let ii=0; ii<result.groups.length; ii++) {
			output.push({
				confidence: result.groups[ii].probability,
				result: result.groups[ii].group
			});
		}

		return output;
	}

}