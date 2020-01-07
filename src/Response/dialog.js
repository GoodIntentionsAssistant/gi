/**
 * Response
 */
const Identifier = girequire('/src/Helpers/identifier');
const Config = girequire('/src/Config/config');

const _ = require('underscore');
const extend = require('extend');
const dotty = require("dotty");
const fs = require('fs');

module.exports = class Dialog {

/**
 * Process the dialog text
 *
 * @param {string} name Name of the dialog to use
 * @param {Object} options Options for dialog, e.g. language
 * @returns {*}
 */
  process(name, options = {}) {
    //Default
    let _options = {
      lang: 'en'
    };
    options = extend(_options, options);

    if(!options.skill) {
      throw new ReferenceError(`Skill for dialog ${name} was not defined`);
    }

    //If the dialog name has a dot-notation it needs to be broken up
    //request.dialog('favorite_city.question');
    //File is favorite_city
    //The json contains an object, question: [], key needs to be extracted
    let file = name;
    let json_path = null;

    if(name.indexOf('.') > -1) {
      const parts = name.split('.');
      file = parts[0];
      json_path = parts[1];
    }

    //Default language
    const default_lang = Config.read('locale.default_language');

    //Build identifier to the dialog file
    let identifier = 'App.Skill.' + options.skill + '.Dialog.' + options.lang + '.' + file;

    //If chosen language is not the default then soft load
    //This means if it fails to fetch the language file it won't throw an error but it will return false
    var options_load = {};
    if(options.lang !== default_lang) {
      options_load.soft = true;
    }

    //
    let contents = this._load(identifier, options_load);

    //If no data was returned and the chosen language was not their default language
    //Then try for the system default language, this can be changed in your config.json file
    if(!contents && options.lang !== default_lang) {
      identifier = 'App.Skill.' + options.skill + '.Dialog.' + default_lang + '.' + file;
      contents = this._load(identifier);
    }

    //If no contents then error
    if(!contents || Object.keys(contents).length === 0) {
      throw new Error(`Dialog file for ${identifier} was empty`);
    }

    //If json_path was defined then we need to tract it from the contents
    if(json_path) {
      contents = dotty.get(contents, json_path);
      if(!contents) {
        throw new Error(`Object key ${json_path} for ${identifier} dialog could not be found`);
      }
    }

    //
    let result = contents;

    //Pick a random array key
    if(contents instanceof Array) {
      result = _.sample(contents);
    }

    return result;
  }


/**
 * Load
 * 
 * @param {string} identifier Identifier for loading the dialog
 * @param {Object} options Options for loading dialog file
 * @returns {Object} Data from the dialog file
 */
  _load(identifier, options = {}) {
    let filename = Identifier.to_file(identifier, {
      append_type: false,
      extension: 'json'
    });

    //Check file exists
    if(!fs.existsSync(filename)) {
      if(options.soft) {
        return false;
      }
      throw new ReferenceError(`Dialog file for ${identifier} was not found, make sure ${filename} exists`);
    }

    //Load contents of the file
    let contents = fs.readFileSync(filename, 'utf8');

    //Empty file, just return a blank json
    if(!contents) {
      return {};
    }

    //Parse the text into json
    let json = JSON.parse(contents);

    return json;
  }

}
