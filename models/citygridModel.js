/* receives a route of boxes and list of places to look up for each box, returning closest match */

var request = require('request');

exports.lookupStops = function(req, res, callback){
	// extract stops and boxed lat long coords
	var params = JSON.parse(req.body.params),
		boxes = params.boxes,
		waypts = params.waypts;

	// keep track of API call progress percentage
	var request_counter = 0,
		requests_progress_pct = 0,
		total_requests = (boxes.length * waypts.length); 

	// loop through all boxes along path
	for(var i = 0; i < boxes.length; i++) {
		// Perform search over this boxed bounds
		var boundaries = boxes[i];

        // loop through every waypoint
        for(var j = 0; j < waypts.length; j++) {

        	// parameters into the GET request
        	var requestParams = {
        		'type': '',
        		'what': waypts[j]
        	};

        	// GET request to citygrid to look up places
	        var get_request = buildGETRequest(boundaries, requestParams);

			request(get_request, function (error, response, body) {

				request_counter++;
				requests_progress_pct = getPercent(request_counter, total_requests);

				// request response
				if (!error && response.statusCode == 200) {
					console.log('PERCENT: ' + requests_progress_pct + '%');

					var requestResponse = {
						'JSONdata': body
					};

					// callback to reply to citygridController
					callback(requestResponse, request_counter, total_requests, params);
				
				} else {
					throw 'ERROR: error response from citygrid API';
				}
			})
		}
	}
};

function returnEmptyStringIfFalsy(str) {
	return ( (str) ? (str) : ('') );
}

function buildGETRequest(boundaries, requestParams) {
	var what = returnEmptyStringIfFalsy(requestParams.what),
		type = returnEmptyStringIfFalsy(requestParams.type);

	return ('http://api.citygridmedia.com/content/places/v2/search/latlon?format=json'
			+ '&what=' + what
			+ '&type=' + type
			+ '&lat=' + boundaries.N
			+ '&lon=' + boundaries.E
			+ '&lat2=' + boundaries.S
			+ '&lon2=' + boundaries.W
			+ '&publisher=test');
}

function getUnixTimestamp() {
	return ( new Date().getTime() );
}

/* rounds from two decimal places of percent
 */
function getPercent(dividend, divisor) {
	var quotient = (dividend / divisor);
	return Math.round(100*(quotient.toFixed(4)));
}

