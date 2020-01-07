/**
 * Prompt
 */
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
 * @param mixed data
 * @return bool
 */
  load(prompt_key) {
    //
    this.request.log(`Prompt set for "${prompt_key}"`);

    //Set the action
    //This will call a method in intent.js
    this.request.action = 'prompt';

    return true;
  }

}