/**
 * Count Six Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class CountSixSecondsIntent extends Intent {

	setup() {
		this.name = 'Count Six Seconds';
		this.train(['count to six']);
	}

	response(request) {
		setTimeout(() => { request.send('1'); }, 1 * 1000);
		setTimeout(() => { request.send('2'); }, 2 * 1000);
		setTimeout(() => { request.send('3'); }, 3 * 1000);
		setTimeout(() => { request.send('4'); }, 4 * 1000);
		setTimeout(() => { request.send('5'); }, 5 * 1000);
		setTimeout(() => {
			request.send('6');
			request.end();
		}, 6 * 1000);

		return false;
	}

}

