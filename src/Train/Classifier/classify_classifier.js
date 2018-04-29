/**
 * Classify NLP Classifier
 */

const Classify = require('../Vendor/classify.js');
const Scrubber = require('../../Utility/scrubber');

module.exports = class ClassifyClassifier {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		this.Classify = new Classify();
	}


/**
 * Train
 *
 * @param string intent
 * @param string keyword
 * @access public
 * @return void
 */
	train(intent, keyword) {	
		this.Classify.train(intent, keyword);
	}


/**
 * Find
 *
 * @param object utterance
 * @access public
 * @return mixed
 */
	find(utterance) {
		//Get the scrubbed text, excluding stop words
		let str = utterance.scrubbed('stopwords');

		let result = this.Classify.rank(str, true);

		console.log(result);

		if(result.groups.length == 0) {
			return false;
		}

		if(result.certainty <= 0.2) {
			return false;
		}

		return {
			confidence: result.certainty,
			result: result.groups[0].group
		};
	}

}