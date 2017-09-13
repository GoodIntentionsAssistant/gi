/**
 * Cities
 */
const Entity = require('../../../Entity/entity');
const moment = require('moment');

module.exports = class CityEntity extends Entity {

	setup() {
		this.name = "Cities";
		this.data = {};
		this.import = {
			type: "custom"
		};
	}

	load_data(resolve, request) {
		let promise = this.app.Data.load('Data.Common.cities', 'json');

		promise.then((json) => {

			for(let key in json.entries) {
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

				this.data[key] = {
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

