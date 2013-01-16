/* receives a route of boxes and list of places to look up for each box, returning closest match */

var request = require('request');

exports.lookupStops = function(wp, box, req, res, callback) {
	// extract stops and boxed lat long coords
		var params = 'empty param',
			boxes = box,
			waypts = wp;

	// keep track of API call progress percentage
	var request_counter = 0,
		requests_progress_pct = 0,
		total_requests = (boxes.length * waypts.length); 

	// loop through all boxes along path
	arrTraverseFromMiddle = traverseFromCenter(boxes)
	for(var i = 0; i < boxes.length; i++) {
		// Perform search over this boxed bounds
		// var boundaries = boxes[i];
		var boundaries = boxes[ arrTraverseFromMiddle[i] ];

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

					var progressCounters =  {
						'request_counter': request_counter,
						'total_requests': total_requests
					};
					// callback to reply to citygridController
					callback(requestResponse, progressCounters, params);
				
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

// start from center and work outwards
function traverseFromCenter(arr) {
	var center = Math.floor(arr.length/2) - 1;
	var index_right = center, index_left = center;
	var objLeft, objRight, objCenter;
	var tempArr = [];
	for(i = 0; i < arr.length/2; i++) {

		if(i == 0) { 
			objCenter = arr[center];
			pushIfDoesntContain(center, tempArr); 
		}

		if(index_right < arr.length-1) {
			index_right++;
			objRight = arr[index_right];
			pushIfDoesntContain(index_right, tempArr); 
			// should parse json object on the spot 
		}			

		if(index_left > 0) {
			index_left--;
			objLeft = arr[index_left];
			pushIfDoesntContain(index_left, tempArr); 
			// should parse json object on the spot
		}

		console.log(objRight + " " + objLeft + " " + objCenter);
	}
	return tempArr;
}

function pushIfDoesntContain(newObject, arr) {
	if(arr.indexOf(newObject) == -1) {
		arr.push(newObject);
		return true;
	}
	return false;
}

