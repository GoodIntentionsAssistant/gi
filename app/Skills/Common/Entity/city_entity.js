/**
 * Cities
 *
 * Data is orginally from moment.timezone
 */
	
var Entity = require('../../../../src/Entity/entity');
var moment = require('moment');

function CityEntity() {
	var entity = {
		name: "Cities",
		data: {},
		import: {
			type: "custom"
		}
	}
	entity.__proto__ = Entity()

	entity.load_data = function(resolve, request) {
		var that = this;

		var filename = this.app.Path.get('app')+"/Common/Data/cities.json";

		var fs = require('fs');
		fs.readFile(filename, 'utf8', function(err, data) {
			var json = JSON.parse(data);

			for(key in json.entries) {
				var synonyms = [];

				var name = json.entries[key].name;
				name = name.substr(name.indexOf('/')+1);
				name = name.replace('/',' ').replace('_',' ');

				synonyms.push(name);

				if(json.entries[key].synonyms) {
					for(var ss=0; ss<json.entries[key].synonyms.length; ss++) {
						synonyms.push(json.entries[key].synonyms[ss]);
					}
				}

				that.data[key] = {
					label:    json.entries[key].name,
					synonyms: synonyms,
					zone_key: key,
					zones: 		json.entries[key].zones,
					lat:  		json.entries[key].lat,
					long:  		json.entries[key].long
				};
			}

			resolve();
		});

	}

	entity.parse = function(string) {
		var result = this.find(string, {
			use_key: false
		});

		if(result.value) {
			result.value = this.data[result.value];
		}

		return result;
	}


	return entity
}

module.exports = CityEntity;
