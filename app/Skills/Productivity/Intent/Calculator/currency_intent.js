// Currency
	
var Intent = require('../../../../../src/Intent/intent');
var Promise = require('promise');
var fx = require('money');

module.exports = class CurrencyIntent extends Intent {

	setup() {
		this.name = 'Currency';
		this.entities = {
			'Productivity/Currency': {}
		};
		this.trigger = 'currency';
		this.synonyms = ['exchange rate'];
		this.parameters = {
			"amount": {
				name: "Amount",
				entity: "Common/Number",
				required: false,
				default: 1,
				from_user: true
			},
			"currency_from": {
				name: "Currency from",
				entity: "Productivity/Currency",
				required: true
			},
			"currency_to": {
				name: "Currency to",
				entity: "Productivity/Currency",
				required: true,
				from_user: true
			}
		};
		/*this.tests = [
			{ input:'1 GBP to BAHT' },
			{ input:'50GBP to baht' },
			{ input:'usd to baht' },
		];*/
	}


	response(request) {
		var amount = request.parameters.value('amount');
		var currency_from = request.parameters.value('currency_from');
		var currency_to = request.parameters.value('currency_to');

		//Double check currency_to is set
		if(!currency_to) {
			return 'To get a currency rate please add in the currency you want to convert to';
		}

		//
		var oxr = require('open-exchange-rates');
		oxr.set({ app_id: 'a7435888f2ab41e9b53123931b81fe31' });

		return new Promise(function(resolve, reject) {
			oxr.latest(function() {
		    fx.rates = oxr.rates;
		    fx.base = oxr.base;

		    try {
		    	var result = fx(amount).from(currency_from).to(currency_to);
			    result = result.toFixed(2);
			    resolve(amount+' '+currency_from+' is '+result+' '+currency_to);
		    }
		    catch(err) {
		    	resolve("Sorry we can't get the exchange rates at the moment");
		    }

		  });
		});
	}

}


