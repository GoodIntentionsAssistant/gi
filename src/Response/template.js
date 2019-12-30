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
  constructor(Response) {
    this.Response = Response;
    this.Request = Response.Request;
    this.App = Response.App;

    this._data = {
      parameters: {}
    };
  }


/**
 * Set data
 * 
 * @param {string} key Key string 
 * @param {*} value Value for the key
 * @returns {boolean}
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
 * Build data for compiler
 * 
 * @returns {Object}
 */
  data() {
    //Add parameters
    let parameters = this.Request.parameters.get();
    for(let key in parameters) {
      this._data[key] = parameters[key].string;
    }

    //User data
    let user = this.Request.user.get();
    for(let key in user) {
      this._data[key] = user[key];
    }

    return this._data;
  }

/**
 * Compile text
 * 
 * @param {string} text Text to compile with templating engine
 * @returns {string}
 */
  compile(text) {
    let data = this.data();
    let template = Handlebars.compile(text);
    let result = template(data);

    return result;
  }

}
