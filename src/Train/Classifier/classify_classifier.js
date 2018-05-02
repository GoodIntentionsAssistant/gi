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
 * Untrain
 *
 * @param stirng intent
 * @access public
 * @return bool
 */
	untrain(intent) {
		this.Classify.untrain(intent);
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

		if(result.groups.length == 0) {
			return false;
		}

		if(result.certainty <= 0.2) {
			return false;
		}

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