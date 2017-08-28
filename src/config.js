/**
 * Config
 */
const dotty = require("dotty");

module.exports = class Config {

	constructor() {
		this.config = require('../config/config.js');
	}

	read(key) {
		return dotty.get(this.config, key);
	}

}
