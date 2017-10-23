/**
 * Favorite number Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class FavoriteNumberIntent extends Intent {

	setup() {
		this.name = 'Favorite number';
		this.train([
      'what is your favorite number'
		]);
	}

	response(request) {
		request.expecting.set({
      action: 'reply',
      entity: 'App.Common.Entity.Number'
		});
    return [
      'Not sure, what is your favorite number?'
    ];
  }
  
  reply(request) {
    var value = request.parameters.value('expects');
    if(value) {
      return 'I think '+value+' is a lucky number too!';
    }
    return 'That is not a number';
  }

}

