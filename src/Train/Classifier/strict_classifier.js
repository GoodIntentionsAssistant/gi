/**
 * Strict Classifier
 */
const Classifier = require('./classifier.js');

module.exports = class StrictClassifier extends Classifier {

/**
 * Find
 *
 * @param {Object} utterance Utterance object
 * @returns {*} Classifier result or false if nothing found
 */
	find(utterance) {
		let str = utterance.original();
		str = str.toLowerCase();

		for(var ii=0; ii<this.data.length; ii++) {
			//Vars
			var keyword = this.data[ii][0];
			var intent = this.data[ii][1];

			//Check if regex
			if(keyword instanceof RegExp) {
				if(str.match(keyword)) {
					return [{
						confidence: 0.9,
						result: intent
					}];
				}
			}
			else if(this.data[ii][0] === str) {
				//String to string
				return [{
					confidence: 1,
					result: intent
				}];
			}

		}

		return false;
	}

}
