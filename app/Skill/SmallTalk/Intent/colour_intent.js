// Colour
	
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class ColourIntent extends Intent {

	setup() {
		this.name = 'Colour';
		this.trigger = 'colour';
		this.synonyms = ["color"];
	}

	response() {
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

}
