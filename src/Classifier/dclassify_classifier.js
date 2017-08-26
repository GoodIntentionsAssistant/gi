
var dclassify = require('dclassify');


var DclassifyClassifier = function() {
	this.trained = false;
	this.intent_keywords = {};
}


/**
 * Initialize
 */
DclassifyClassifier.prototype.initialize = function() {
	this.Classifier = new dclassify.Classifier();
}


DclassifyClassifier.prototype.train = function(intent, keyword) {
	//Create a document
	if(!this.intent_keywords[intent]) {
		this.intent_keywords[intent] = [];
	}

	this.intent_keywords[intent].push(keyword);
/*
	var doc = new this.Dclassify.Document(intent, [keyword]);
	this.intent_documents[intent]


	var data = new this.Dclassify.DataSet();
	data.add(intent,  [item1]);

	this.Classifier.train(data);*/
}


DclassifyClassifier.prototype._train = function() {

	for(var intent in this.intent_keywords) {
		var item = new dclassify.Document(intent, this.intent_keywords[intent]);
		var data = new dclassify.DataSet();
		data.add(intent, [item]);
		this.Classifier.train(data);
	}

	this.trained = true;
}


DclassifyClassifier.prototype.find = function(str) {
	if(!this.trained) {
		this._train();
	}

	var testDoc = new dclassify.Document('testDoc', ['who']);    
  var result1 = this.Classifier.classify(testDoc);

  console.log(result1);

	return this.Classify.classify(str);
}


module.exports = DclassifyClassifier;
