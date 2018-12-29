/**
 * Response
 */
const Identifier = girequire('src/Core/identifier');
const Config = girequire('src/Config/config');

const _ = require('underscore');
const extend = require('extend');

module.exports = class Dialog {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor() {
  }


/**
 * Process the dialog text
 *
 * @access public
 * @return bool
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

    //Default language
    let default_lang = Config.read('locale.default_language');

    //Build identifier to the dialog file
    let identifier = 'App.Skill.'+options.skill+'.Dialog.'+options.lang+'.'+name;

    //If chosen language is not the default then soft load
    //This means if it fails to fetch the language file it won't throw an error but it will return false
    var options_load = {};
    if(options.lang != default_lang) {
      options_load.soft = true;
    }

    //
    let contents = this._load(identifier, options_load);

    //If no data was returned and the chosen language was not their default language
    //Then try for the system default language, this can be changed in your config.json file
    if(!contents && options.lang != default_lang) {
      identifier = 'App.Skill.' + options.skill + '.Dialog.' + default_lang + '.' + name;
      contents = this._load(identifier);
    }

    //If no contents then error
    if(!contents) {
      throw new Error(`Dialog file for ${identifier} was empty`);
    }

    //Pick a random array key
    let result = _.sample(contents)

    return result;
  }


/**
 * Load
 * 
 * @param string identifier 
 * @access private
 * @return string
 */
  _load(identifier, options = {}) {
    let filename = Identifier.to_file(identifier, {
      append_type: false,
      extension: 'json'
    });

    let fs = require('fs');

    //Check file exists
    if(!fs.existsSync(filename)) {
      if(options.soft) {
        return false;
      }
      throw new ReferenceError(`Dialog file for ${identifier} was not found, make sure ${filename} exists`);
    }

    //Load contents of the file
    let contents = fs.readFileSync(filename, 'utf8');

    //Try to parse the json
    let json = JSON.parse(contents);

    return json;
  }

}
