/**
 * Config
 */
const dotty = require("dotty");

module.exports = class Config {

	constructor(config = false) {
		if(!config) {
			this.config = require('../config/config.js');
		}
		else {
			this.config = config;
		}
	}

	read(key) {
		return dotty.get(this.config, key);
	}

	write(key, value) {
		dotty.put(this.config, key, value);
	}

}
