/**
 * Classify NLP Classifier
 */

const Classify = require('../../../library/classify.js');

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
 * @param string str
 * @access public
 * @return mixed
 */
	find(str) {
		var result = this.Classify.rank(str);

		if(result.groups.length == 0) {
			return false;
		}

		if(result.certainty <= 0.2 || result.certainty == 1) {
			return false;
		}

		return {
			confidence: result.certainty,
			result: result.groups[0].group
		};
	}

}