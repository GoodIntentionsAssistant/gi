/**
 * Label Classifier
 */
const Classifier = require('./classifier.js');

module.exports = class LabelClassifier extends Classifier {

/**
 * Find
 *
 * @param {Object} utterance Utterance object
 * @returns {*} Classifier result or false if nothing found
 */
	find(utterance) {
		let str = utterance.scrubbed();

		//Matches
		let matches = [];

		//Find which labels are required
		for(let ii=0; ii<this.data.length; ii++) {
			let _label = this.data[ii][0].substring(1);
			
			if(utterance.is(_label)) {
				matches.push(_label);
			}
		}

		//No matches then no match was found
		//The users utterance / inputted text did not match the required label
		if(matches.length === 0) {
			return false;
		}

		return [{
			confidence: 1
		}];
	}

}
