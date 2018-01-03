/**
 * Config
 */
const dotty = require('dotty');
const fs = require('fs');


/**
 * Get file
 * 
 * @todo Find out better way to handle this
 */
exports._get_file = function() {
	let config_file = '../../app/Config/config.js';
	this.config = require(config_file);
}


/**
 * Read
 * 
 * @param string key
 * @return mixed
 */
exports.read = function(key) {
	this._get_file();
	return dotty.get(this.config, key);
}


