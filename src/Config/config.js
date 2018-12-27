/**
 * Config
 */
const dotty = require('dotty');
const fs = require('fs');
const extend = require('extend');

global.gi_config = {};


/**
 * Get file
 * 
 * @todo Find out better way to handle this
 */
exports._init = function() {
	//Config data already loaded
	if(Object.keys(global.gi_config).length > 0) {
		return;
	}

	//Load default
	let default_filename = './src/Config/default.json';
	let default_data = fs.readFileSync(default_filename, { encoding: 'utf-8' });
	let default_json = JSON.parse(default_data);

	//Load app
	let app_filename = './app/Config/config.json';
	let app_data = fs.readFileSync(app_filename, { encoding: 'utf-8' });
	let app_json = JSON.parse(app_data);

	//Merge them together
	let json = extend(default_json, app_json);
	global.gi_config = json;
}


/**
 * Read
 * 
 * @param string key
 * @return mixed
 */
exports.read = function(key) {
	this._init();
	return dotty.get(global.gi_config, key);
}


/**
 * Get path
 * 
 * @param string key
 * @return mixed
 */
exports.path = function(path) {
	this._init();
	path = 'paths.' + path;

	var result = dotty.get(global.gi_config, path);

	result = __dirname+result;

	return result;
}


