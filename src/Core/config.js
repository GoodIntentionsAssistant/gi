/**
 * Config
 */
const dotty = require("dotty");
const fs = require('fs');


exports._get_file = function() {
	let config_file = '../../app/Config/config.js';
	this.config = require(config_file);
}


exports.read = function(key) {
	this._get_file();
	return dotty.get(this.config, key);
}



// module.exports = class Config {

// /**
//  * Constructor
//  *
//  * @param object App
//  * @param hash config
//  * @access public
//  * @return void
//  */
// 	constructor(App, config = false) {
// 		//Passing the config for testing
// 		if(config) {
// 			this.config = config;
// 			return;
// 		}
		
// 		let config_file = '../../app/Config/config.js';

// 		try {
// 			this.config = require(config_file);
// 		}
// 		catch(e) {
// 			App.Error.fatal('App config file not found, check you have created app/Config/config.json file');
// 		}

// 		return true;
// 	}


// /**
//  * Read
//  *
//  * @param string key
//  * @access public
//  * @return mixed
//  */
// 	read(key) {
// 		return dotty.get(this.config, key);
// 	}


// /**
//  * Constructor
//  *
//  * @param string key
//  * @param string value
//  * @access public
//  * @return void
//  */
// 	write(key, value) {
// 		dotty.put(this.config, key, value);
// 	}

// }
