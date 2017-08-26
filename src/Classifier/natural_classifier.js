
var Natural = require('natural');


var NaturalClassifier = function() {
	this.trained = false;
}


/**
 * Initialize
 */
NaturalClassifier.prototype.initialize = function() {
	this.Classifier = new Natural.BayesClassifier();
}


NaturalClassifier.prototype.train = function(intent, keyword) {
	keyword = keyword.replace('is ','');
	keyword = keyword.replace('in ','');
	keyword = keyword.replace('the ','');

	if(keyword.length == 2) {
		return;
	}

	this.Classifier.addDocument(keyword, intent);
}

NaturalClassifier.prototype._train = function() {
	this.Classifier.train();
	this.trained = true;
}


NaturalClassifier.prototype.find = function(str) {
	if(!this.trained) {
		this._train();
	}

	console.log(this.Classifier.getClassifications(str));

	return this.Classifier.classify(str);
}


module.exports = NaturalClassifier;
