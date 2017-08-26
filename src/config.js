/**
 * Config
 */

var Config = function() {
	this.app_dir =  __dirname+'/../apps';
	this.root_dir =  __dirname+'/..';

	this.admin = {
		password: 'hungry55'
	};

	this.agents = {
		'test': {
			'token': 'NrCgyKqvyB'
		},
		'webhook': {
			'token': 'qkkl7Xb0Cc'
		},
		'devi-hybrid': {
			'token': 'ChzBlEM6VC'
		}
	};

	this.learn = {
		default_classifier: 'classify'
	};

	this.response = {
		min_reply_time: 500,
		letter_speed: 20,
		max_response: 2000
	};

	this.classifiers = {
		'_default': {
			'classifier': 'classify'
		},
		'admin': {
			'classifier': 'strict'
		},
		'strict': {
			'classifier': 'strict'
		},
		'main': {
			'classifier': 'classify'
		},
		'fallback': {
			'classifier': 'classify'
		}
	}

	this.queue = {
		speed: 500,
		max_consecutive: 1,
		timeout: 5000
	};

	this.server = {
		enabled: true,
		port: 3000
	};
	
}


module.exports = Config
