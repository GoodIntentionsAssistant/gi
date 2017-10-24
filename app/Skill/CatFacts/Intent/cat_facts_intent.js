/**
 * Cat Facts Intent
 */
const Intent = require('../../../../src/Intent/intent');
const Promise = require('promise');
const _ = require('underscore');

module.exports = class CatfactsIntent extends Intent {

	setup() {
		this.train([
			'catfact',
			'cat facts',
			'cat fact'
		]);

		this.tests([
			{ input:'catfact' },
			{ input:'cat fact' },
			{ input:'cat facts' },
			{ input:'give me a cat fact' }
		]);
	}

	response(request) {
		var filename = request.app.Path.get('skills.app')+'/CatFacts/Data/catfacts.txt';

		return new Promise(function(resolve, reject) {
			var fs = require('fs');
			fs.readFile(filename, 'utf8', function(err, data) {
				var lines = data.split(/\r?\n/);
				resolve(_.sample(lines));
			});
		});
	}

}

