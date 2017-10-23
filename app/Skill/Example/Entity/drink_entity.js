/**
 * Drink Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class DrinkEntity extends Entity {

	setup() {
		this.import = {
			type: 'custom'
		};
	}


	load_data(resolve, options) {
		let fs = require('fs');
		let filename = this.app.Path.get('skills.app') + '/Example/Data/drinks.txt';
		let output = {};

		let promise = new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf8', function(err, data) {
				if (err) throw err;
				var lines = data.split(/\r?\n/);
				for(var ii=0; ii<lines.length; ii++) {
					if(!lines[ii]) { break; }
					output[lines[ii]] = {};
				}
				resolve(output);
			});
		});

		return promise;
	}

}