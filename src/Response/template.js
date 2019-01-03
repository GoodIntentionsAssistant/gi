/**
 * Template
 */
const Handlebars = require('handlebars');

module.exports = class Template {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor(Request) {
    this.Request = Request;
    this.App = Request.app;

    this._data = {
      parameters: {}
    };
  }


/**
 * Set data
 * 
 * @param mixed key 
 * @param string value optional
 */
  set(key, value = '') {
    if(key instanceof Object) {
      for(var _item in key) {
        this._data[_item] = key[_item];
      }
      return true;
    }

    this._data[key] = value;
  }


/**
 * Build data for compiler
 * 
 * @access public
 * @return void
 */
  data() {
    //Add parameters to both the parameter key and root
    let parameters = this.Request.parameters.get();
    for(var key in parameters) {
      this._data.parameters[key] = parameters[key].string;
      this._data[key] = parameters[key].string;
    }

    return this._data;
  }

/**
 * Compile text
 * 
 * @param string text 
 * @access public
 * @return string
 */
  compile(text) {
    let data = this.data();
    let template = Handlebars.compile(text);
    let result = template(data);

    return result;
  }

}
