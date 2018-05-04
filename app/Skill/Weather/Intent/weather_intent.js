/**
 * Weather Intent
 */
const Intent = require('../../../../src/Intent/intent');
const Forecast = require('forecast');
const Promise = require('promise');

module.exports = class WeatherIntent extends Intent {

	setup() {
		this.train([
			'weather'
		]);

		this.parameter('city', {
			name: "City",
			entity: "App.Common.Entity.City",
			required: false,
			action: 'specified',
			slotfill: true
		});
	}


	response(request) {
		request.expect('reply');
		return 'For the weather please specify the city';
	}

	specified(request) {
		let city = request.parameters.get('city.data');

		let label = city.label;
		let lat 	= city.lat;
		let long 	= city.long;

		let forecast = new Forecast({
		  service: 'darksky',
		  key: '136a4563badc66b047e42eb74472f285',
		  units: 'celcius',
		  cache: true
		});

		return new Promise(function(resolve, reject) {

			try {
				forecast.get([lat, long], function(err, weather) {
				  if(err) {
				  	resolve('Sorry, I cannot get the weather at the moment');
				  }
				  else {
				  	let temp = Math.round(weather.currently.temperature);
				  	let summary = weather.currently.summary;
				  	let location = label;
				  	location = location.replace('/',', ');

				  	let output = [];
				  	output.push('Currently '+temp+'c, '+summary+' in '+location);
				  	output.push(weather.daily.summary+' (provided by darksky.net)');
				  	resolve(output);
				  }
				});
	    }
	    catch(err) {
	    	resolve("Sorry I can't get the weather at the moment");
	    }

		});
	}

}

