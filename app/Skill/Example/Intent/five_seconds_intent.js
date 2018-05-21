/**
 * Five Seconds Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class FiveSecondsIntent extends Intent {

	setup() {
		this.train(['five seconds'],{
      collection: 'strict'
    });
	}

	response() {
		return new Promise(function(resolve, reject){
      setTimeout(() => {
        resolve('5 seconds are up');
      }, 5 * 1000);
		});
	}

}

