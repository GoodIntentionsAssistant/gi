/**
 * Country
 */
const Entity = require('../../../Entity/entity');
const Scrubber = require('../../../../src/Utility/scrubber');
const moment = require('moment');

module.exports = class CountryEntity extends Entity {

	setup() {
		this.name = "Date";
		this.data = {};
		this.ignore_index_key = true;
		this.import = {
			type: "custom"
		};
	}

	load_data(resolve, request) {
		var that = this;

		var filename = this.app.Path.get('skills.sys')+"/Common/Data/countries.json";

		console.log(filename);

		var fs = require('fs');
		fs.readFile(filename, 'utf8', function(err, data) {
			var json = JSON.parse(data);

			for(let key in json.entries) {
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


	parse(string) {
		var result = this.find(string, {
			use_key: false
		});

		if(result.value) {
			result.value = this.data[result.value];
		}

		return result;
	}

}

