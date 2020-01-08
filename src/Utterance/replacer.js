/**
 * Replacer
 */
const Data = girequire('src/Helpers/data');

const extend = require('extend');
const fs = require('fs');

global.gi_replacer = {};

module.exports = class Replacer {

/**
 * Constructor
 * 
 * @constructor
 */
constructor() {
  this.dataPath = './data/Language';
}

/**
 * Process text
 * 
 * @todo Document what this method does
 * @param {string} type Type of replacer
 * @param {string} str String to replace
 * @param {Object} options Options for processing
 * @returns {string} Final string that has been replaced
 */
  process(type, str, options = {}) {
    //Options
    let _options = {
      lang: 'en',
      cache: true,
      dataPath: null
    };
    options = extend(_options, options);

    //Change data path if set in options
    if(options.dataPath) {
      this.dataPath = options.dataPath;
    }

    //Check if the directory for this type exists
    if(!this.directoryExists(type, options.lang)) {
      return false;
    }

    //Load all files in the 'type' directory and join them together
    let results = this.data(type, options);

    //
    results.forEach((result) => {
      str = this._replace(str, result.data.entries);
    });

    return str;
  }


/**
 * Return the data
 * 
 * @param {string} type Type of directory for data
 * @param {Object} options Options, e.g. for language
 * @return {string[]} Array of data
 */
  data(type, options) {
    //Exists already and use global cache
    if(global.gi_replacer[type]) {
      return global.gi_replacer[type];
    }

    //Build data
    let results = [];

    //Fetch files for this type
    let files = this._files(type, options);

    files.forEach((file) => {
      var data = this._readFile(file.file);

      //No data
      if(!data) {
        return;
      }

      if(file.type === 'json') {
        results.push({
          data: JSON.parse(data)
        });
      }
      else if(file.type === 'txt') {
        results.push({
          data: this._convertTxtToJson(data)
        });
      }
    });

    global.gi_replacer[type] = results;

    return results;
  }

 
/**
 * Convert txt to json format
 * 
 * @param {string} data File data
 * @returns {Object} Converted output
 */
  _convertTxtToJson(data) {
    let output = {
      entries: {}
    };

    const entries = data.split("\n");

    for(let ii=0; ii<entries.length; ii++) {
      //Break the text file into two parts, "foo bar"
      //'foo' will be replaced with 'bar'
      const seperator = ' ';

      const parts = entries[ii].split(seperator);

      //If 'bar' does not exist or the key is empty
      if(parts.length === 1 || !parts[0]) {
        continue;
      }

      const _key = parts[0];
      const _replace = parts[1].replace('+',' ');
      
      output.entries[_key] = {
        replace: _replace
      };
    }

    return output;
  }


/**
 * Read data file
 * 
 * @param {string} filename File name to read
 * @returns {string} File data
 */
  _readFile(filename) {
    let contents = fs.readFileSync(filename).toString();
    return contents;
  }
  

/**
 * Replace text
 * 
 * @param {string} str Incoming string
 * @param {Object} entries Object data from json file
 * @returns {string} Outputted string after processed
 */
  _replace(str, entries) {

    for(let word in entries) {
      let regex = null;

      if(entries[word].match === 'start') {
        regex = new RegExp('^'+word, 'gi');
      }
      else if(entries[word].match === 'end') {
        regex = new RegExp(word+'$', 'gi');
      }
      else {
        //Default do all
        regex = new RegExp('\\b('+word+')\\b', 'gi');
      }

      //Replace with?
      let replace_with = ' ';

      if(entries[word].replace) {
        replace_with = entries[word].replace;
      }

      str = str.replace(regex, replace_with);
    }

    str = str.trim();
    str = str.replace(/ +(?= )/g,'');

    return str;
  }


/**
 * Path name
 * 
 * @param {string} type Type of data
 * @param {string} lang Language directory
 * @returns {string} Path name
 */
  pathName(type, lang = 'en') {
    return this.dataPath + '/' + lang + '/' + type;
  }


/**
 * Check if directory exists
 * 
 * @param {string} type Type of data
 * @param {string} lang Language, e.g. fr
 * @returns {boolean} If directory exists
 */
  directoryExists(type, lang) {
    const path = this.pathName(type, lang);
    if(!fs.existsSync(path)) {
      return false;
    }
    return true;
  }


/**
 * Files
 * 
 * @param {string} type Type of data
 * @param {Object} options Options for loading
 * @returns {string[]} Array of files found in the data directory
 */
  _files(type, options = {}) {
    const path = this.pathName(type, options.lang);

    let files = [];
    
    fs.readdirSync(path).forEach((file) => {
      if((file.indexOf('.json') > -1 || file.indexOf('.txt') > -1) && file.indexOf('__') === -1) {
        files.push({
          file: path+'/'+file,
          type: (file.indexOf('.txt') > -1) ? 'txt' : 'json'
        });
      }
    });

    return files;
  }

}
