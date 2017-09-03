// Currency
//http://stackoverflow.com/questions/28198370/regex-for-validating-correct-input-for-calculator
	
var Intent = require('../../../../src/Intent/intent');

module.exports = class CalculatorIntent extends Intent {

	setup() {
		this.name = 'Calculator';
		this.trigger = '/^(calc )?[\\d\\+\\/\\*\.\\-% \\(\\)=]*$/';
		this.classifier = 'strict';
		this.synonyms = [
			'/^[\\d+]*%( of)? [\\d\\+\\/\\*\.\\- \\(\\)=]*$/',
			new RegExp(/^.*[\d+] x [\d+].*$/,'g')
		];
		this.entities = {
			'Productivity/MathWord': {
				'classifier': 'main'
			}
		};
		this.parameters = {
			"math_word": {
				name: "Math word",
				entity: 'Productivity/MathWord'
			}
		};
		this.tests = [
			{ input:"calc 1+1" },
			{ input:"calc 666 * 666" },
			{ input:"calc 666 * 666 + 10" },
			{ input:"10% of 90" },
			{ input:"90 + 5%" },
			{ input:"2+2" },
			{ input:"what is 5 x 10?" },
			{ input:"what is 5 times 10?" },
			{ input:"what is 5 multiplied by 10?" }
		];
	}


	response(request) {
		//Clean up the string
		var input = this.clean_string(request, request.input.text);

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


	clean_string(request, input) {
		//Replace math strings, e.g. times to *
		let math_string = request.parameters.get('math_word.string');
		if(math_string) {
			let math_value = request.parameters.get('math_word.matched.value');
			let rep = new RegExp(math_string,'ig');
			input = input.replace(rep, math_value);
		}

		//Remove chars that are not needed for math
		input = input.replace(/[a-z\!\?=]/ig,'');
		input = input.trim(input);

		return input;
	}


	calc_simple(input) {
		return eval(input);
	}

	calc_percentage(input) {
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
}
