/**
 * Template
 */
const Handlebars = require('handlebars');

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
    if(key instanceof Object) {
      for(var _item in key) {
        this._data[_item] = key[_item];
      }
      return true;
    }

    this._data[key] = value;

    return true;
  }


/**
 * Load data from parameters
 * 
 * @param {Object} data Parameter data
 * @returns {boolean}
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
 * @returns {boolean}
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
 * @returns {string}
 */
  compile(text) {
    let data = this._data;
    let template = Handlebars.compile(text);
    let result = template(data);

    return result;
  }

}
