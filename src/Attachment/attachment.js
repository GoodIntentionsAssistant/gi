/**
 * Attachment
 */
const Logger = girequire('/src/Helpers/logger');

module.exports = class Attachment {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.app = app;
    this._validators = {};

    this.load();
  }


/**
 * Load
 *
 * @returns {boolean} Success of loading
 */
  load() {
    return true;
  }


/**
 * Add validation
 *
 * @param {string} field Field
 * @param {Object} options Options for validation, can be empty
 * @returns {boolean} Success of adding validation
 */
  validate(field, options = {}) {
    this._validators[field] = options;
    return true;
  }


/**
 * Check validation
 *
 * @todo Keep failed reasons so can be outputted
 * @param {string} field Field
 * @returns {boolean} Success of validating
 */
  checkValidation(data) {
    //Validates
    let _validates = true;

    //Go through each validation and check if it exists in data and has a value
    //For now validation only checks if it's empty. Later find a validation module
    //that can be used across the system.
    for(let key in this._validators) {
      if(!data[key]) {
        Logger.warn(`Missing "${key}"`, { prefix: this.identifier });
        _validates = false;
      }
    }

    return _validates;
  }


/**
 * Build
 *
 * @param {*} data Data to pass to attachment
 * @returns {*} Attachment reply
 */
  build(data, ...args) {
    //Check validation
    if(!this.checkValidation(data)) {
      Logger.warn(`Attachment could not be added because it failed validation`, { prefix: this.identifier });
      return false;
    }

    //Build and return
    return this._build(data, ...args);
  }

}