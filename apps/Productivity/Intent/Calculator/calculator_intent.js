// Currency
//http://stackoverflow.com/questions/28198370/regex-for-validating-correct-input-for-calculator
	
var Intent = require('../../../../src/Intent/intent');

function CalculatorIntent() {
	var methods = {
		name: 'Calculator',
		trigger: '/^(calc )?[\\d\\+\\/\\*\.\\-% \\(\\)=]*$/',
		classifier: 'strict',
		synonyms: [
			'/^[\\d+]*%( of)? [\\d\\+\\/\\*\.\\- \\(\\)=]*$/'
		],
		tests: [
			{ input:"calc 1+1" },
			{ input:"calc 666 * 666" },
			{ input:"calc 666 * 666 + 10" },
			{ input:"10% of 90" },
			{ input:"90 + 5%" },
			{ input:"2+2" },
			{ input:"what is 14 x 15?" }
		]
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		//Remove any bad stuff
		var input = request.input.text;
		input = input.replace(/[a-z=]/ig,'');
		input = input.trim(input);

		if(!input) {
			return 'Oops, there seemed to be a problem calculating that';
		}

		//Type of calculation
		var method = 'simple';
		if(input.indexOf('%') > -1) {
			method = 'percentage';
		}

		//Result
		var result = null;
		try {
			method = 'calc_'+method;
			var result = this[method](input);
		}
		catch(err) {
		}

		if(!result) {
			result = 'Sorry, I had a problem calculating '+input;
		}

		return result;
	}

	methods.calc_simple = function(input) {
		return eval(input);
	}

	methods.calc_percentage = function(input) {
		//Find the percentage number we need
		var match = input.match(/[\d+]*%/);

		if(!match) {
			return false;
		}

		//Input
		input = input.trim();

		//Get percentage value
		var percentage = match[0];
		percentage = percentage.replace('%','');

		//Remaining
		var remaining = input;
		remaining = remaining.replace(match[0],'');
		remaining = remaining.trim();

		//Against
		var split = remaining.match(/^(\d+)/);
		var against = split[0];

		//What ever is left
		remaining = remaining.replace(/^(\d+)/,'');
		remaining = remaining.trim();

		//If no numerical remaining then clear
		if(!remaining.match(/\d+/)) {
			remaining = '';
		}

		//90% + 5?
		if(input.substr(-1)) {
			remaining += ' + '+against;
		}

		//5% of 400 = 20
		//5 / 100 * 400

		var cmd = '('+percentage+' / 100 * '+against+') '+remaining;

		//console.log(cmd);

		return this.calc_simple(cmd);
	}

	return methods
}


module.exports = CalculatorIntent;
