var request = require('request');

exports.geocode = function(waypt, callback) {
	var get_request = GETgeocodingURI(waypt);

	request(get_request, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var parsedResponse = JSON.parse(body),
				status = parsedResponse.status;
				console.log('geocoding status: ' + status)
			callback(waypt, status);
		} else {
			callback(waypt, 'GOOGLE GEOCODING ERROR');
		}
	})
}

function GETgeocodingURI(address) {
	return 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false';
}

