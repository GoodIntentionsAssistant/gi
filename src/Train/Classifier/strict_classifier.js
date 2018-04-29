/**
 * Strict Classifier
 */

module.exports = class StrictClassifier {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		this.data = [];
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
		this.data.push([keyword, intent]);
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
			else if(this.data[ii][0] == str) {
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
