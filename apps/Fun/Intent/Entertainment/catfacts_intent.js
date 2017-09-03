// Cat Facts
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

module.exports = class CatfactsIntent extends Intent {

	setup() {
		this.name = 'Catfacts';
		this.trigger = 'catfact';
		this.synonyms = {
			'catfacts': {},
			'cat fact': {}
		};
		this.tests = [
			{ input:'catfact' },
			{ input:'cat fact' },
			{ input:'cat facts' },
			{ input:'give me a cat fact' }
		];
	}

	response(request) {
		var filename = request.app.Config.read('app_dir')+'/Fun/Data/catfacts.txt';

		return new Promise(function(resolve, reject) {
			var fs = require('fs');
			fs.readFile(filename, 'utf8', function(err, data) {
				var lines = data.split(/\r?\n/);
				resolve(_.sample(lines));
			});
		});
	}

}

