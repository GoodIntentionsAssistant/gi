// Weather
	
var Intent = require('../../../../src/Intent/intent');
var Forecast = require('forecast');
var Promise = require('promise');

function WeatherIntent() {
	var methods = {
		name: 'Weather',
		trigger: 'weather',
		synonyms: [
			'what is the weather'
		],
		entities: {
			'Common/City': {}
		},
		parameters: {
			"city": {
				name: "City",
				entity: "Common/City",
				required: false,
				action: 'specified',
				from_user: true
			}
		}
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		return 'For the weather please specify the city';
	}

	methods.specified = function(request) {
		var city = request.param('city');

		var label = city.label;
		var lat = city.lat;
		var long = city.long;

		var forecast = new Forecast({
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
				  	var temp = Math.round(weather.currently.temperature);
				  	var summary = weather.currently.summary;
				  	var location = label;
				  	location = location.replace('/',', ');

				  	var output = [];
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

	return methods
}


module.exports = WeatherIntent;