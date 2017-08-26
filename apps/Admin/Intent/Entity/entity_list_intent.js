// Entity List
	
var Admin = require('../admin');
var sprintf = require('sprintf-js').sprintf;

function EntityListIntent() {
	var methods = {
		name: 'EntityList',
		trigger: 'entity list'
	}
	methods.__proto__ = Admin()

	methods.response = function(response) {
		var output = [];

		output.push('Entity List');

		var entities = response.app.Entities.objects;

		var count = Object.keys(entities).length;
		output.push(sprintf('%s entities loaded',count));

		for(var key in entities) {
			var size = JSON.stringify(entities[key].data).length;
			var name = entities[key].name;

			//Check if the entity is live data
			if(key.indexOf('::') > 0) {
				name = name + ' / ' + key.substr(key.indexOf('::')+2);
			}

			output.push('- '+name+' (data: '+size+')');
		}

		return output;
	}

	return methods
}

module.exports = EntityListIntent;
