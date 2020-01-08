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
 * @param {string} key Dot notated key
 * @returns {*} Value of config
 */
exports.read = function(key) {
	this._init();
	return dotty.get(global.gi_config, key);
}


/**
 * Get path
 * 
 * @param {string} path Dot notated key
 * @returns {*} String of the path name
 */
exports.path = function(path) {
	this._init();
	path = 'paths.' + path;

	var result = dotty.get(global.gi_config, path);
	result = __dirname+result;

	return result;
}


/**
 * Put
 * 
 * @param {string} key Dot notated key
 * @returns {boolean} If written to file
 */
exports.put = function(key, value) {
	let app_filename = './app/Config/config.json';
	let app_data = fs.readFileSync(app_filename, { encoding: 'utf-8' });
	let app_json = JSON.parse(app_data);

	var _data = dotty.get(app_json, key);
	_data.push(value);

	dotty.put(app_json, key, _data);

	return this._writeConfig(app_json);
}


/**
 * Remove
 * 
 * @param {string} key Dot notated key
 * @returns {boolean} If removed config from file
 */
exports.remove = function(key) {
	let app_filename = './app/Config/config.json';
	let app_data = fs.readFileSync(app_filename, { encoding: 'utf-8' });
	let app_json = JSON.parse(app_data);

	//Break the kets up
	let path = key.split(".");
	let root = path[0];
	let value = path[1];

	var path_value = app_json[root];
	path_value = path_value.filter((e) => { e !== value });

	//
	dotty.put(app_json, root, path_value);

	this._writeConfig(app_json);

	return true;
}


/**
 * Write config
 * 
 * @param {Object} json Json to write to file
 * @returns {boolean} Success
 */
exports._writeConfig = function(json) {
	let data = JSON.stringify(json, null, 2);
	let app_filename = './app/Config/config.json';
	return fs.writeFileSync(app_filename, data);  
}


