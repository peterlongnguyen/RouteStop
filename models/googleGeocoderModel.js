var request = require('request');

exports.geocode = function(waypt, callback) {
	var get_request = GETgeocodingURI(waypt);
	console.log('geocode: ' + waypt);
	request(get_request, function (error, response, body) {
		console.log(' callbacking: ' + waypt);
		if (!error && response.statusCode == 200) {
			callback( waypt, isOk_DSTKwrapper(waypt, body) );
		} else {
			callback(waypt, 'GOOGLE GEOCODING ERROR');
		}
	})
}

// actually uses data science tool kit's API instead, as google would instead convert queries
// such as 'chevron' or 'in-n-out' into arbitrary locations instead of returning an error to signify
// that it wasn't a valid address
function GETgeocodingURI(address) {
	// return 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false';
	// return 'http://www.datasciencetoolkit.org/maps/api/geocode/json?address=' + address + '&sensor=false';
	return 'http://www.datasciencetoolkit.org/street2coordinates/' + address;
}

// JSON.parse wasn't properly converting to javascript, so have to parse it as string, searching for 'null' value
function isOk_DSTKwrapper(waypoint, stringResponse) {
	console.log('is ok dstk wrapper : ' + waypoint);
	var nullValue = ( '"' + waypoint + '": null' );
	if(stringResponse.indexOf(nullValue) == -1) {
		return 'OK';
	} else {
		return 'NOT OK';
	}
}

