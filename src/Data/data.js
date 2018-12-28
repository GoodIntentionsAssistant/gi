/**
 * Data
 */
const Identifier = require('../Core/identifier');

const _ = require('underscore');

module.exports = class Data {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(App) {
		this.App = App;
	}


/**
 * Load data
 *
 * @param string identifier
 * @param string format
 * @return Promise
 */
	load(identifier, format) {
		//Build data file name
		let filename = Identifier.to_file(identifier, { append_type: false, extension: format });

		//Check the data file exists
		if(!this._check_file(filename)) {
			this.App.Error.fatal([
				'Failed to load data from ' + identifier,
				'Make sure the data file exists in '+filename
			]);
			return;
		}

		//Depending on the file format of the data load it in
		switch(format) {
			case 'json':
				return this._load_json(filename);
				break;
			case 'csv':
				return this._load_csv(filename);
				break;
		}
		
	}


/**
 * Check the file before trying to load it
 *
 * @param string filename
 * @return bool
 */
	_check_file(filename) {
		let fs = require('fs');
		if(!fs.existsSync(filename)) {
			return false;
		}

		return true;
	}


/**
 * Load JSON
 *
 * @param string filename
 * @return Promise
 */
	_load_json(filename) {
		let fs = require('fs');

		let promise = new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf8', (err, data) => {
				if (err) throw err;

				let json = JSON.parse(data);

				//Validate entries exists
				if(!json.entries) {
					this.App.Error.fatal([
						'Failed to load JSON entity data from '+this.identifier,
						'Make sure the key "entries" exists in the file'
					]);
				}

			  resolve(json);
			});
		});

	  return promise;
	}


/**
 * Load CSV data
 *
 * @param string filename
 * @return Promise
 */
	_load_csv(filename) {
		let fs = require('fs');
		let output = {};

		let promise = new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf8', (err, data) => {
				if (err) throw err;
				
				var lines = data.split(/\r?\n/);
				for(var ii=0; ii<lines.length; ii++) {
					if(!lines[ii]) { break; }

					//Break key and synonyms
					var parts = lines[ii].split(/,/);

					//Key
					var key = parts[0];
					key = key.trim();
					key = key.replace(/"/g,'');

					//Get synonyms and trim white spaces
					var synonyms = [];
					for(var ss=1; ss<parts.length; ss++) {
						var word = parts[ss].trim().toLowerCase();
						word = word.replace(/"/g,'');
						synonyms.push(word);
					}

					//Add to data
					output[key] = {
						synonyms: synonyms
					}
				}

				resolve(output);
			});
		});

		return promise;
	}


}