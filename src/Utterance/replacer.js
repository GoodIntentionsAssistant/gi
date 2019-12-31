/**
 * Replacer
 */
const Data = girequire('src/Data/data');

const extend = require('extend');
const fs = require('fs');

global.gi_replacer = {};

module.exports = class Replacer {

/**
 * Process text
 * 
 * @param {string} type 
 * @param {string} str 
 * @param {Object} options 
 * @returns {string} Final string that has been replaced
 */
  process(type, str, options = {}) {
    //Options
    let _options = {
      lang: 'en'
    };
    options = extend(_options, options);

    let results = this.data(type, options);

    results.forEach((result) => {
      if(result.type === 'json') {
        str = this._replaceJson(str, result.data.entries);
      }
      else if(result.type === 'txt') {
        str = this._replaceTxt(str, result.data);
      }
    });

    return str;
  }


/**
 * Return the data
 * 
 * @return mixed
 */
  data(type, options) {
    //Exists already
    //Use cache
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
          type: 'json',
          data: JSON.parse(data)
        });
      }
      else if(file.type === 'txt') {
        results.push({
          type: 'txt',
          data: data.split("\n")
        });
      }
    });

    global.gi_replacer[type] = results;

    return results;
  }


/**
 * Read json file
 * 
 * @param string filename 
 * @return string
 */
  _readFile(filename) {
    let contents = fs.readFileSync(filename).toString();
    return contents;
  }
  

/**
 * Replace text
 * 
 * @param string str 
 * @param Object entries 
 * @return string
 */
  _replaceJson(str, entries) {

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
      var replace_with = ' ';

      if(entries[word].replace) {
        replace_with = entries[word].replace;
      }

      str = str.replace(regex, replace_with);
    }

    str = str.trim();

    return str;
  }


/**
 * Replace text
 * 
 * @param string str 
 * @param string context
 * @return string
 */
  _replaceTxt(str, entries) {

    for(var ii=0; ii<entries.length; ii++) {
      let parts = entries[ii].split(" ");
      let _match = parts[0];
      let _replace = parts[1].replace('+',' ');

      var regex = new RegExp('\\b(' + _match + ')\\b', 'gi');
      str = str.replace(regex, _replace);
    }

    return str;
  }

/**
 * Files
 * 
 * @todo Scan directories and find multiple files
 * @todo Throw and error if the file does not exist
 * @param string type 
 * @param Object options 
 * @return array
 */
  _files(type, options = {}) {
    let path = './data/Language/'+options.lang+'/'+type;

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
