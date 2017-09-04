
const Classify = require('../../../library/classify.js');


var ClassifyClassifier = function() {
}


/**
 * Initialize
 */
ClassifyClassifier.prototype.initialize = function() {
	this.Classify = new Classify();
}


ClassifyClassifier.prototype.train = function(intent, keyword) {	
	this.Classify.train(intent, keyword);
}


ClassifyClassifier.prototype.find = function(str) {
	var result = this.Classify.rank(str);

	if(result.groups.length == 0) {
		return false;
	}

	if(result.certainty <= 0.2) {
		return false;
	}

	return {
		confidence: result.certainty,
		result: result.groups[0].group
	};
}


module.exports = ClassifyClassifier;
