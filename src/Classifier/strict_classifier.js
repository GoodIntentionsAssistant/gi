
var StrictClassifier = function() {
	this.data = [];
}


/**
 * Initialize
 */
StrictClassifier.prototype.initialize = function() {
}


StrictClassifier.prototype.train = function(intent, keyword) {
	this.data.push([keyword, intent]);
}


StrictClassifier.prototype.find = function(str) {

	for(var ii=0; ii<this.data.length; ii++) {
		//Vars
		var keyword = this.data[ii][0];
		var intent = this.data[ii][1];

		//Check if regex
		if(keyword.substr(0,1) == '/') {
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

}


module.exports = StrictClassifier;
