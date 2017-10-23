/**
 * Date Entity
 */
const Entity = require('../../../../src/Entity/entity');
const moment = require('moment');

function DateEntity() {
	var entity = {
		import: {
			file: "Common/Data/dates.json",
			type: "json"
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var original = null;
		var value = null;

		//Do dict search
		var search = this.find(string);

		var months = this.build_words(this.data, {
			type:'month'
		});

		var aa = this.match_month_ordinal(string, months);
		console.log(aa);

		//Basic
		//var easy = this.match_easy(search);

		//2st Jan etc...
		/*for(key in this.data) {
			var words = new Array();
			words.push(key);
			if(this.data[key].synonyms) {
				for(var ii=0; ii<this.data[key].synonyms.length; ii++) {
					words.push(this.data[key].synonyms[ii]);
				}
			}

			console.log(words);
			for(var ii=0; ii<words.length; ii++) {
				var rgxp = new RegExp('1st '+words[ii], "gi");
				console.log(string.match(rgxp));
			}
		}*/


/*
		string = string.toLowerCase();

		for(key in this.data) {
			var rgxp = new RegExp('1st '+key, "g");
			console.log(string.match(rgxp));
		}
*/
		return {
			value: value,
			original: original
		}
	}


	entity.match_easy = function(search) {
		if(search.value == 'tomorrow') {
			value = moment().add(1, 'days');
		}
		else if(search.value == 'yesterday') {
			value = moment().subtract(1, 'days');
		}
		else if(search.value == 'today') {
			value = moment();
		}
		return value;
	}


	entity.match_month_ordinal = function(string, months) {

		console.log(string);

		for(var ii=0; ii<months.length; ii++) {
			var rgxp = new RegExp('1st '+months[ii], "gi");
			console.log(string.match(rgxp));
		}

	}


	return entity
}

module.exports = DateEntity;
