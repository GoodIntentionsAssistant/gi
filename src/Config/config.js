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
	let filename = './app/Config/config.json';
	var data = fs.readFileSync(filename, { encoding: 'utf-8' });
	var json = JSON.parse(data);
	
	this.config = json;
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


/**
 * Get path
 * 
 * @param string key
 * @return mixed
 */
exports.path = function(path) {
	this._get_file();

	path = 'paths.' + path;

	var result = dotty.get(this.config, path);

	result = __dirname+result;

	return result;
}


