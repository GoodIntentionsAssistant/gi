/**
 * Fallback Classifier
 */

const Classify = require('../Vendor/classify.js');

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
		let str = utterance.scrubbed();
		let result = this.Classify.rank(str);

		if(result.groups.length == 0) {
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