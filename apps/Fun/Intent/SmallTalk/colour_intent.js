// Colour
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function ColourIntent() {
	var methods = {
		name: 'Colour',
		trigger: 'colour',
		synonyms: ["color"]
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var wrapper = ["probably %s","i'd go with %s","%s has always been my favorite"];
		var choices = ["red","green","blue","pink","black","white","purple","#FF0000"];

		var output = _.sample(wrapper);
		var colour = _.sample(choices);
		output = output.replace('%s',colour);
		
		var output = [
			output
		];
		return output;
	}

	return methods
}


module.exports = ColourIntent;
