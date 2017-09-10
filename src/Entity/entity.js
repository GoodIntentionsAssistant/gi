/**
 * Entity
 */
const extend = require('extend');
const Promise = require('promise');
const _ = require('underscore');

module.exports = class Entity {

/**
 * Constructor
 *
 * @param object app
 * @return void
 */
	constructor(app) {
		this.app = app;

		if(!this.data) {
			this.data = {};
		}
	}


/**
 * Load
 *
 * @access public
 * @return void
 */
	load(options) {
		var that = this;

		this.promise = new Promise(function(resolve, reject) {
			if(that.import) {
				that._import(that.import, resolve, options);
			}
			else {
				//Entity has data set already
				resolve();
			}
		});
	}


/**
 * Import
 *
 * @access public
 * @return void
 */
	_import(settings, resolve, options) {
		if(settings.type == 'custom') {
			//Load custom
			this.load_data(resolve, options.request);
		}
		else if(settings.type == 'json') {
			//Load from local json file
			this.load_data_json(settings.file, resolve);
		}
		else if(settings.type == 'csv') {
			//Load from local CSV file
			this.load_data_csv(settings.file, resolve);
		}
		else {
			console.error('No import type specified');
			process.exit();
		}
	}


/**
 * Load CSV data
 *
 * @param string filename
 * @param method resolve
 * @return boolean
 */
	load_data_csv(identifier, resolve) {
		//For scoping when reading the file
		var that = this;

		let filename = this.identifier_to_filename(identifier, 'csv');

		//Load the file go through each line
		//Split by tab and add anything in the second part into synonyms
		var fs = require('fs');
		fs.readFile(filename, 'utf8', function(err, data) {
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
				that.data[key] = {
					synonyms: synonyms
				}
			}

			//Entity is now ready
			resolve();
		});
	}


/**
 * Load JSON data
 *
 * @param string filename
 * @param method resolve
 * @return boolean
 */
	load_data_json(identifier, resolve) {
		//For scoping when reading the file
		var that = this;
		let filename = this.identifier_to_filename(identifier, 'json');

		//Load the file go through each line
		//Split by tab and add anything in the second part into synonyms
		var fs = require('fs');
		fs.readFile(filename, 'utf8', function(err, data) {
			if (err) throw err;

			//No data
			if(!data) {
				resolve();
			}

			var json = JSON.parse(data);

			//Invalid json
			if(!json) {
				resolve();
			}

			that.data = json.entries;
			resolve();
		});
	}


/**
 * Get data
 *
 * @access public
 * @return array
 */
	get_data() {
		return this.data;
	}


/**
 * Get data by key
 *
 * @access public
 * @return array
 */
	find_data_by_key(key) {
		return this.data[key];
	}


/**
 * Find string in data
 *
 * Method will go through the entity.data and try to find strings
 * that was inputted. If the string is found it'll return the first
 * instance, this is why position is used.
 *
 * @param string string
 * @return array
 */
	find(string, options) {
		//Options
		var _options = {
			use_key: true
		};
		options = extend(_options, options);

		//Build a list of matches
		var last_position = 999;

		//If a match is found then the original tokenised string is returned
		//so it can be removed from the final string so it's not parsed again
		var original = null;

		//Value is the key of the entity data
		var value = null;
		var record = null;

		//Matches
		var matches = [];

		//Clean up the string
		string = string.toLowerCase();

		//Loop each data in the entity
		for(var key in this.data) {
			//Pack the synonyms and the main data key together
			var _list = [];

			//Use the data key
			if(options.use_key) {
				_list.push(key.toLowerCase());
			}

			//Add synonyms to list
			if(this.data[key].synonyms) {
				for(var ss=0; ss<this.data[key].synonyms.length; ss++) {
					_list.push(this.data[key].synonyms[ss].toLowerCase());
				}
			}

			//Loop through the list and try to find the array list in the string
			for(var ii = 0; ii < _list.length; ii++) {
				var position = string.indexOf(_list[ii]);

				if(position > -1) {
					matches.push({
						position: position,
						string: _list[ii],
						value: key
					});
				}

				//Check if the string exists in the array
				//Then set the position, we want to find the FIRST result
				//If you don't check position then it'll just find the first match
				//e.g. "45 GBP to BAHT", it will find BAHT first and return that
				//but we keep scanning, we find GBP and its position is before BAHT so we change the value
				/*if(position > -1 && position < last_position) {
					original = _list[ii];
					last_position = position;
					value = key;
				}*/
			}
		}

		//Score each
		if(matches.length == 1) {
			original = matches[0].string;
			value = matches[0].value;
		}
		else if(matches.length > 1) {
			//Score each match based on position and a few regular expressions
			var scores = [];
			for(var ii=0; ii<matches.length; ii++) {
				var _score = this.score(string, matches[ii].string, matches[ii].position);
				matches[ii].score = _score;
			}

			//Sort the results by score then reverse the array so
			//the highest score is the first record
			matches = _.sortBy(matches, function(record){ return record.score; }).reverse();

			original = matches[0].string;
			value = matches[0].value;
		}

		//Matched data
		let matched = this.find_data_by_key(value);

		return {
			original: original,
			value: value,
			matched: matched
		}
	}


/**
 * Score words
 *
 */
	score(string, keyword, position) {
		var score = 0;

		//Position score
		//The lower the number the higher score it'll get
		var position_score = (string.length - position) / 10;
		score = score + position_score;

		//Horrible hack until I figure out regex's below
		string = ' '+string+' ';

		//String found with two spaces either side
		var one = new RegExp(" "+keyword+" ", 'i');
		if(string.match(one)) {
			score = score + 2;
		}

		//String found with space after
		var two = new RegExp(keyword+" ", 'i');
		if(string.match(two)) {
			score = score + 0.2;
		}

		//String found with space before
		var three = new RegExp(" "+keyword, 'i');
		if(string.match(three)) {
			score = score + 0.1;
		}

		return score;
	}


/**
 * Build list of words from data
 *
 */
	build_words(data, conditions) {
		if(!data) {
			data = this.data;
		}

		//Loop each data in the entity
		var words = [];
		for(var key in data) {
			//Conditions
			var pass = true;
			if(conditions) {
				for(var field in conditions) {
					if(data[key][field] != conditions[field]) {
						pass = false;
					}
				}
			}
			if(!pass) {
				continue;
			}

			//Pack the synonyms and the main data key together
			var line = [];
			line.push(key.toLowerCase());

			//Add synonyms to list
			if(data[key].synonyms) {
				for(var ss=0; ss<data[key].synonyms.length; ss++) {
					line.push(data[key].synonyms[ss].toLowerCase());
				}
			}

			words.push(line);
		}

		return words;
	}


/**
 * Identifier to filename
 *
 * @param string name
 * @access public
 * @return string
 */
  identifier_to_filename(identifier, extension) {
		let parts = identifier.split('.');

    let type = parts[0];
		let skill = parts[1];

		let path = this.app.Path.get('skills.'+type.toLowerCase());
		
		parts.shift();
		let filename = path + '/' + parts.join('/') + '.' + extension;

		return filename;
  }

}
