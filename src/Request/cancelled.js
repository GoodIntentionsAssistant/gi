/**
 * Cancelled
 */
const Logger = girequire('/src/Helpers/logger');

module.exports = class Cancelled {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Request instance
 */
	constructor(request) {
    this.request = request;
    this.app = request.app;
	}

  
/**
 * Check the request
 * 
 * @returns {boolean} Success of checking the request
 */
	check() {
    //Check something should be cancelled
    //For this will will just change the intent
    let cancel = this.app.Understand.process(this.request.utterance, ['cancel']);
    
		if(cancel.success) {
      Logger.info('Cancelling request', { prefix:this.request.ident });

      this.request.expects.reset();
      
			this.request.intent 		= cancel.matches[0].intent;
			this.request.collection = cancel.matches[0].collection;
			this.request.confidence = cancel.matches[0].confidence;
		}

		return true;
	}



}



