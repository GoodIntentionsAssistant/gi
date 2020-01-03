/**
 * Template
 */
const Handlebars = require('handlebars');
const dotty = require("dotty");

module.exports = class Template {

/**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    this._data = {};
  }


/**
 * Set data
 * 
 * @param {string} key Key string 
 * @param {*} value Value for the key, if passed as object then expand
 * @returns {boolean} Success of adding data
 */
  set(key, value = '') {
    dotty.put(this._data, key, value);
    return true;
  }


/**
 * Load data from parameters
 * 
 * @param {Object} data Parameter data
 * @returns {boolean} Success of setting data
 */
  data_from_parameters(data) {
    for(let key in data) {
      this.set(key, data[key].string);
    }
    return true;
  }


/**
 * Load data from user
 * 
 * @param {Object} data User data
 * @returns {boolean} Success of setting data
 */
  data_from_user(data) {
    for(let key in data) {
      this.set(key, data[key]);
    }
    return true;
  }


/**
 * Compile text
 * 
 * @param {string} text Text to compile with templating engine
 * @returns {string} Compiled text output
 */
  compile(text) {
    let data = this._data;
    let template = Handlebars.compile(text);
    let result = template(data);

    return result;
  }

}
