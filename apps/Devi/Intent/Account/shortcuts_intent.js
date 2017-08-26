// Shortcuts
	
var Intent = require('../../../../src/Intent/intent');

function ShortcutsIntent() {
	var methods = {
		name: 'Shortcuts',
		trigger: 'shortcuts',
		classifier: 'strict'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var data = [];

		data.push('Hello');
		data.push('Time in Bangkok');
		data.push('50 GBP to USD');
		data.push('Catfact');
		data.push('Weather in London');

		for(var ii=0; ii<data.length; ii++) {
			request.attachment.add_shortcut(data[ii]);
		}

		return 'Shortcuts';
	}

	return methods
}


module.exports = ShortcutsIntent;
