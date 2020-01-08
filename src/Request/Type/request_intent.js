/**
 * Request Intent
 */
const Request = girequire('/src/Request/request');

module.exports = class RequestIntent extends Request {

/**
 * Process
 * 
 * @returns {boolean} If to process
 */
  process() {
    //Check the intent exists
    if(!this.app.IntentRegistry.exists(this.input.intent)) {
      throw new Error(`Intent ${this.input.intent} does not exist`);
    }

    let intent = this.app.IntentRegistry.get(this.input.intent);

    this.intent     = intent;
    this.action     = 'response';
    this.confidence = 1;

    //Check if action was specified
    if(this.input.action) {
      this.action = this.input.action;
    }

    //Dispatch intent call
    let result = this.call();

    if(!result) {
      this.resolve();
    }

    return false;
  }


}
