/**
 * Random Colour Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class RandomColourIntent extends Intent {

	setup() {
		this.train([
      'random colour'
    ]);
	}

	response(request) {
    let entity = request.app.EntityRegistry.get('App.Example.Entity.Colour');
    let data = entity.get_data();
		let output = _.sample(Object.keys(data));
		return 'Random colour is '+output;
	}

}

