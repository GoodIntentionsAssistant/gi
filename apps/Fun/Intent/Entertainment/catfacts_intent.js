// Cat Facts
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

function CatfactsIntent() {
	var methods = {
		name: 'Catfacts',
		trigger: 'catfact',
		synonyms: {
			'catfacts': {},
			'cat fact': {}
		},
		tests: [
			{ input:'catfact' },
			{ input:'cat fact' },
			{ input:'cat facts' },
			{ input:'give me a cat fact' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var filename = request.app.Config.read('app_dir')+'/Fun/Data/catfacts.txt';

		return new Promise(function(resolve, reject) {
			var fs = require('fs');
			fs.readFile(filename, 'utf8', function(err, data) {
				var lines = data.split(/\r?\n/);
				resolve(_.sample(lines));
			});
		});
	}

	return methods
}


module.exports = CatfactsIntent;
