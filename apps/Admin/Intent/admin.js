// Admin
var Intent = require('../../../src/Intent/intent');
	
function Admin() {
	var methods = {
		classifier: 'admin',
		auth: 'admin'
	}
	methods.__proto__ = Intent()

	methods.before_load = function() {
		this.trigger = 'admin '+this.trigger;
	}

	return methods
}

module.exports = Admin;
