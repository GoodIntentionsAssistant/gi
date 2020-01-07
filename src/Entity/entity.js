/**
 * Entity
 */
const extend = require('extend');
const Promise = require('promise');
const _ = require('underscore');

const Logger = girequire('/src/Helpers/logger');

module.exports = class Entity {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		this.app = app;
		this.loaded = false;

		if(!this.data) {
			this.data = {};
		}
	}


/**
 * Load
 *
 * Load in the data for the entity and check using promises.
 * Data can be loaded in async or hardcoded into the entity so
 * the promise can be resolved straight away.
 *
 * @todo Handle reject method
 * @param {Object} options Options for import
 * @returns {boolean} Success of loading
 */
	load(options) {
		this.before_load();

		this.promise = new Promise((resolve, reject) => {
			if(this.import) {
				this._import(this.import, resolve, options);
			}
			else {
				//Entity has data set already
				resolve();
			}
		});

		this.promise.then(() => {
			this.after_load();
		});
		
		return true;
	}


/**
 * Import
 *
 * @todo Recode this method
 * @param {Object} settings Settings for import
 * @param {Object} resolve Promise resolve method after data has been imported
 * @param {Object} options Options for import
 * @returns {boolean}
 */
	_import(settings, resolve, options) {
		let is_promise = false;					//Check if loading the data is using a promise
		let result = null;							//The result of calling the data loading
		let entity_key = false;					//If the data result has a `entries`. key, used for json importing

		//Load data in depending on the type
		if(settings.type === 'custom') {
			//Load custom
			result = this.load_data(resolve, options);
			is_promise = (Promise.resolve(result) === result);
		}
		else if(settings.type === 'json') {
			//Load from local json file
			result = this.app.Data.load(settings.file, 'json');
			entity_key = true;
			is_promise = true;
		}
		else if(settings.type === 'csv') {
			//Load from local CSV file
			result = this.app.Data.load(settings.file, 'csv');
			is_promise = true;
		}
		else {
			//@todo should this be a throw error?
			Logger.warn('No import type specified');
		}

		//Check return type
		if(is_promise) {
			result.then((data) => {
				if(entity_key) {
					this.data = data.entries;
				}
				else {
					this.data = data;
				}

				this.loaded = true;
				resolve();
			});
		}
		else {
			this.loaded = true;
			resolve();
			return true;
		}

		return true;
	}


/**
 * Set data
 *
 * @param {Object} data Data to set into entity
 * @returns {boolean} Success
 */
	set_data(data) {
		//Check how the data is being passed
		//If the data is being passed in the second format then change it to the first format with hash key values
		//1. { "pizza":{}, "burger": {}, "fries": {} }
		//2. ["pizza", "burger", "fries"]
		if(data.constructor === Array) {
			let _data = {};

			data.forEach((key) => {
				_data[key] = {};
			});

			data = _data;
		}

		this.data = data;

		return true;
	}


/**
 * Get data
 *
 * @returns {Object} Data
 */
	get_data() {
		return this.data;
	}


/**
 * Get data by key
 *
 * @todo Clarify what this is and check if the key exists
 * @param {string} key Key for data
 * @returns {string[]} List od data
 */
	find_data_by_key(key) {
		return this.data[key];
	}


/**
 * Parse the string
 *
 * @param {string} string String to parse
 * @returns {Object} Results
 */
  parse(string) {
    let result = this.find(string);
    return result;
	}
	

/**
 * Find string in data
 *
 * Method will go through the entity.data and try to find strings
 * that was inputted. If the string is found it'll return the first
 * instance, this is why position is used.
 *
 * @param {string} string String to find in data
 * @param {Object} options Options for find
 * @returns {Object} Results
 */
	find(string, options = {}) {
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
		var position = null;

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
				for(let ss=0; ss<this.data[key].synonyms.length; ss++) {
					_list.push(this.data[key].synonyms[ss].toLowerCase());
				}
			}

			//Loop through the list and try to find the array list in the string
			for(let ii = 0; ii < _list.length; ii++) {
				let result = this.find_word(_list[ii], string);

				if(result) {
					matches.push({
						position: result.position,
						string: _list[ii],
						value: key
					});
				}
			}
		}

		//Score each
		if(matches.length === 1) {
			//Just one match so no reason to score
			original 	= matches[0].string;
			value 		= matches[0].value;
			position 	= matches[0].position;
		}
		else if(matches.length > 1) {
			//Score each match based on position and a few regular expressions
			var scores = [];
			for(let ii=0; ii<matches.length; ii++) {
				var _score = this.score(string, matches[ii].string, matches[ii].position);
				matches[ii].score = _score;
			}

			//Sort the results by score then reverse the array so
			//the highest score is the first record
			matches = _.sortBy(matches, function(record){ return record.score; }).reverse();

			original 	= matches[0].string;
			value 		= matches[0].value;
			position  = matches[0].position;
		}

		//Matched data
		let matched = this.find_data_by_key(value);

		return {
			original,
			value,
			matched,
			position
		}
	}


/**
 * Find word in input
 *
 * @param {string} word Word from the entity
 * @param {string} input User input
 * @param {Object} options Options for finding word
 * @returns {Object}
 */
  find_word(word, input, options = {}) {
		//Options
		//@todo Method only supporting indexOf for now
		var _options = {
			method: 'indexOf'
		};
		options = extend(_options, options);

		let position = input.indexOf(word);

		if(position === -1) {
			return false;
		}

		return {
			position
		};
  }


/**
 * Score words
 *
 * @param {string} string Original string
 * @param {string} keyword Keyword matched
 * @param {number} position Position in the string
 * @returns {number} Score value
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
 * @param {Object} data Data from entity
 * @param {Object} conditions Conditions for build words???
 * @returns {string[]} List of words
 */
	build_words(data, conditions) {
		if(!data) {
			data = this.data;
		}

		//Loop each data in the entity
		var words = [];
		for(let key in data) {
			//Conditions
			var pass = true;
			if(conditions) {
				for(var field in conditions) {
					if(data[key][field] !== conditions[field]) {
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
 * Before load call back
 * 
 * @returns boolean
 */
  before_load() {
		return true;
  }


/**
 * After load call back
 * 
 * @returns boolean
 */
  after_load() {
		return true;
  }


}
