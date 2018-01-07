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
	}

	response(request) {
		let filename = request.app.Path.get('skills.app')+'/CatFacts/Data/catfacts.txt';

		return new Promise((resolve, reject) => {
			let fs = require('fs');
			fs.readFile(filename, 'utf8', (err, data) => {
				let lines = data.split(/\r?\n/);
				resolve(_.sample(lines));
			});
		});
	}

}

