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
  load(data) {
    //
    this.request.log('Setting prompt');

    //Set the message for the intent to pick up
    this.request.parameters.set('prompt', data);

    //Set the action
    //This will call a method in intent.js
    this.request.action = 'prompt';

    return true;
  }

}