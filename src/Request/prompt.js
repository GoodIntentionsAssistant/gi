/**
 * Prompt
 */
module.exports = class Prompt {

/**
 * Constructor
 *
 * @param object request
 * @access public
 * @return void
 */
  constructor(request) {
    this.request = request;
  }


/**
 * Load and handle the prompt
 *
 * @param mixed data
 * @access public
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