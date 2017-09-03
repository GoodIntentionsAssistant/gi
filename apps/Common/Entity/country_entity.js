/**
 * Country
 *
 * Data is orginally from moment.timezone
 */
	
var Entity = require('../../../src/Entity/entity');
var Scrubber = require('../../../src/Utility/scrubber');
var moment = require('moment');

function CountryEntity() {
	var entity = {
		name: "Date",
		data: {},
		ignore_index_key: true,
		import: {
			type: "custom"
		}
	}
	entity.__proto__ = Entity()

	entity.load_data = function(resolve, request) {
		var that = this;

		var filename = this.app.Config.read('app_dir')+"/Common/Data/countries.json";

		var fs = require('fs');
		fs.readFile(filename, 'utf8', function(err, data) {
			var json = JSON.parse(data);

			for(key in json.entries) {
				var entry = json.entries[key];

				var synonyms = [];

				//Name and clean it up
				var name = entry.name.toLowerCase();
				name = Scrubber.token_length(name,2);
				name = Scrubber.brackets(name);
				name = Scrubber.stop_words(name);

				synonyms.push(name);

				//
				if(entry.synonyms) {
					for(var ss=0; ss<entry.synonyms.length; ss++) {
						synonyms.push(entry.synonyms[ss]);
					}
				}

				that.data[key] = {
					label: entry.name,
					synonyms:synonyms,
					zone_key: entry.zones[0],
					zones: entry.zones
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

module.exports = CountryEntity;
