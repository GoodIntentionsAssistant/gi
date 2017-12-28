/**
 * Date Entity
 */
const Entity = require('../../../../src/Entity/entity');
const moment = require('moment');

module.exports = class DateEntity extends Entity {

  setup() {
    this.import = {
      file: "Data.Common.countries",
      type: "json"
    };
  }

	parse(string) {
		var original = null;
		var value = null;

		console.log(string);

		let chrono = require('chrono-node');
		let parsed_date = chrono.parse(string);

		if(parsed_date.length > 0) {
			original = parsed_date[0].text;
			value = parsed_date[0].start.date();
		}

		return {
			value: value,
			original: original
		}
	}

}
