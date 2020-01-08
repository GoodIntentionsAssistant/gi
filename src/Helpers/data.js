/**
 * Data
 */
const _ = require('underscore');
const fs = require('fs');

const Identifier = girequire('/src/Helpers/identifier');

/**
 * Load data
 *
 * @param {string} identifier Identifier of where the data is, which will convert to a file name
 * @param {string} format Format to load the data in as, e.g. json, csv
 * @returns {*} Promise or false
 */
exports.load = function(identifier, format) {
  //Build data file name
  let filename = Identifier.to_file(identifier, {
    append_type: false,
    extension: format
  });

  //Check the data file exists
  if(!this._check_file(filename)) {
    throw new Error(`Failed to load data from "${identifier}", make sure the data file exists, ${filename}`);
  }

  //Depending on the file format of the data load it in
  switch(format) {
    case 'json':
      return this._load_json(filename);
    case 'csv':
      return this._load_csv(filename);
  }
  
  return false;
}


/**
 * Check the file before trying to load it
 *
 * @param {string} filename File name to check if exists
 * @returns {boolean} If file exists
 */
exports._check_file = function(filename) {
  if(!fs.existsSync(filename)) {
    return false;
  }
  return true;
}


/**
 * Load JSON
 *
 * @param {string} filename File name to load JSON
 * @returns {Promise} Promise for loading the file
 */
exports._load_json = function(filename) {

  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if(err) {
        throw err;
      }

      let json = JSON.parse(data);

      //Validate entries exists
      if(!json.entries) {
        throw new Error(`Failed to load JSON entity data from "${this.identifier}". Make sure the key "entries" exists in the file`);
      }

      resolve(json);
    });
  });

  return promise;
}


/**
 * Load CSV data
 *
 * @param {string} filename File name to load in CSV data
 * @returns {Promise} Promise for loading the file
 */
exports._load_csv = function(filename) {
  let output = {};

  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if(err) {
        throw err;
      }
      
      var lines = data.split(/\r?\n/);
      for(var ii=0; ii<lines.length; ii++) {
        if(!lines[ii]) { break; }

        //Break key and synonyms
        var parts = lines[ii].split(/,/);

        //Key
        var key = parts[0];
        key = key.trim();
        key = key.replace(/"/g,'');

        //Get synonyms and trim white spaces
        var synonyms = [];
        for(var ss=1; ss<parts.length; ss++) {
          var word = parts[ss].trim().toLowerCase();
          word = word.replace(/"/g,'');
          synonyms.push(word);
        }

        //Add to data
        output[key] = {
          synonyms
        }
      }

      resolve(output);
    });
  });

  return promise;
}
