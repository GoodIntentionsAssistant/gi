/**
 * Tag Classifier
 */
const Classifier = require('./classifier.js');

module.exports = class TagClassifier extends Classifier {

/**
 * Find
 *
 * @param object utterance
 * @access public
 * @return mixed
 */
	find(utterance) {
		let str = utterance.scrubbed();

		//Matches
		let matches = [];

		//Find which tags are required
		for(let ii=0; ii<this.data.length; ii++) {
			let _tag = this.data[ii][0].substring(1);
			
			if(utterance.is(_tag)) {
				matches.push(_tag);
			}
		}

		//No matches then no match was found
		//The users utterance / inputted text did not match the required tag
		if(matches.length == 0) {
			return false;
		}

		return [{
			confidence: 1
		}];
	}

}
