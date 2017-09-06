/**
 * Config
 */
const dotty = require("dotty");

module.exports = class Config {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(config = false) {
		if(!config) {
			this.config = require('../../app/Config/config.js');

			console.log(this.config);
		}
		else {
			this.config = config;
		}
	}


/**
 * Read
 *
 * @param string key
 * @access public
 * @return mixed
 */
	read(key) {
		return dotty.get(this.config, key);
	}


/**
 * Constructor
 *
 * @param string key
 * @param string value
 * @access public
 * @return void
 */
	write(key, value) {
		dotty.put(this.config, key, value);
	}

}
