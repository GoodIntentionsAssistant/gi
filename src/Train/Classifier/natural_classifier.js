/**
 * Natural NLP Classifier
 */
const natural = require('natural');

module.exports = class NaturalClassifier {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		this.Classifier =  new natural.BayesClassifier();
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
		this.Classifier.addDocument(keyword, intent);
		this.Classifier.train();
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

		let result = this.Classifier.getClassifications(str);


		console.log(result);
		if(result.length == 0) {
			return false;
		}

		if(result[0].value <= 0.0004) {
			return false;
		}

		return {
			confidence: result[0].value,
			result: result[0].label
		};
	}

}