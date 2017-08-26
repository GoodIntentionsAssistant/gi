// Admin Login
	
var Intent = require('../../../../src/Intent/intent');

function AdminLoginIntent() {
	var methods = {
		name: 'AdminLogin',
		trigger: '/admin login .*/',
		classifier: 'admin'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var password = request.input.text;
		password = password.replace('admin login','').trim();

		if(password != request.app.config.admin.password) {
			return 'Failed to log you in';
		}

		request.session.set_auth('admin',true);
		return 'You are now logged in as an admin';
	}

	return methods
}

module.exports = AdminLoginIntent;
