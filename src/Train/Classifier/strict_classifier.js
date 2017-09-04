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
 * @param string str
 * @access public
 * @return mixed
 */
	find(str) {

		for(var ii=0; ii<this.data.length; ii++) {
			//Vars
			var keyword = this.data[ii][0];
			var intent = this.data[ii][1];

			//Check if regex
			if(keyword instanceof RegExp) {
				if(str.match(keyword)) {
					return {
						confidence: 0.9,
						result: intent
					};
				}
			}
			else if(keyword.substr(0,1) == '/') {
				var keyword = keyword.substr(1,keyword.length-2);
				var rgxp = new RegExp(keyword,'g');
				if(str.match(rgxp)) {
					return {
						confidence: 0.9,
						result: intent
					};
				}
			}
			else if(this.data[ii][0] == str) {
				//String to string
				return {
					confidence: 1,
					result: intent
				};
			}

		}

		return false;
	}

}
