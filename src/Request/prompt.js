/**
 * Prompt
 */
const Logger = girequire('/src/Helpers/logger.js');

module.exports = class Prompt {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Request instance
 */
  constructor(request) {
    this.request = request;
  }


/**
 * Load and handle the prompt
 *
 * @param {string} prompt_key Key for prompt
 * @returns {boolean} Success of setting the action to prompt
 */
  load(prompt_key) {
    //
    Logger.info(`Prompt set for "${prompt_key}"`, { prefix: this.request.ident });

    //Set the action
    //This will call a method in intent.js
    this.request.action = 'prompt';

    return true;
  }

}