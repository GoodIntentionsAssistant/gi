/**
 * Country
 */
const Entity = require('../../../../src/Entity/entity');
const Scrubber = require('../../../../src/Utility/scrubber');
const moment = require('moment');

module.exports = class CountryEntity extends Entity {

	setup() {
		this.data = {};
		this.ignore_index_key = true;
		this.import = {
			type: "custom"
		};
	}

	load_data(resolve, request) {
		let promise = this.app.Data.load('Data.Common.countries', 'json');

		promise.then((json) => {
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

				this.data[key] = {
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

