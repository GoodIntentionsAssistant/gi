// Help
	
var Intent = require('../../../../src/Intent/intent');

function HelpIntent() {
	var methods = {
		name: 'Help',
		trigger: 'help'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		return 'I will help you another time';
	}

	return methods
}

module.exports = HelpIntent;
