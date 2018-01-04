/**
 * Data
 */
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
		//For scoping when reading the file
		let filename = this.identifier_to_filename(identifier, format);

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


/**
 * Identifier to filename
 *
 * @param string identifier
 * @param string extension
 * @todo Move this and other identifier methods to a central class
 * @access public
 * @return string
 */
  identifier_to_filename(identifier, extension) {
		let parts = identifier.split('.');

    let type = parts[0];
		let skill = parts[1];
		let path = null;
		
		if(type == 'App') {
			path = this.App.Path.get('skills.app');
		}
		else {
			path = this.App.Path.get('data');
		}
		
		parts.shift();
		let filename = path + '/' + parts.join('/') + '.' + extension;

		return filename;
	}
	

}