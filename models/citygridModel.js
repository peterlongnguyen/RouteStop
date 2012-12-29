/* receives a route of boxes and list of places to look up for each box, returning closest match */

var request = require('request');

exports.lookupStops = function(req, res, callback){
	// console.log("testing passing variables: " + req.body.params);
	var params = JSON.parse(req.body.params);
	var boxes = params.boxes;
	var waypts = params.waypts;
	console.log('boxes: ' + boxes.length + ' waypts: ' + waypts.length);
	var start_time = new Date().getTime();

	var request_counter = 0,
		requests_progress_pct = 0,
		total_requests = (boxes.length * waypts.length); 

	// loop through all boxes along path
	for(var i = 0; i < boxes.length; i++) {
		var boundaries = boxes[i];
        // Perform search over this bounds

        // get coordinate of each direction
        var N = boundaries.N;
        var S = boundaries.S;
        var E = boundaries.E;
        var W = boundaries.W;

        // loop again and search for every waypoint
        for(var j = 0; j < waypts.length; j++) {

        	// GET request to citygrid to look up places
	        var get_request = 'http://api.citygridmedia.com/content/places/v2/search/latlon?format=json'
	        				+ '&what=' + waypts[j] 
	        				// + '&type=' +
	        				+ '&lat=' + N 
	        				+ '&lon=' + E 
	        				+ '&lat2=' + S 
	        				+ '&lon2=' + W 
	        				+ '&publisher=test';

			request(get_request, function (error, response, body) {

				request_counter++;
				requests_progress_pct = getPercent(request_counter, total_requests);

				if (!error && response.statusCode == 200) {
					console.log('PERCENT: ' + requests_progress_pct + '%');
					var data = {
						'body': body
					};
					callback(data, request_counter, total_requests, params);

					// var end_time = getUnixTimestamp();
					// var time = end_time - start_time;
				}

				// @todo: need to check data integrity, especially if errorcode
				if(request_counter == (total_requests)) {
					console.log("end of file!");
				}
			})
		}
	}
};

function getUnixTimestamp() {
	return ( new Date().getTime() );
}

/* rounds from two decimal places of percent
 */
function getPercent(dividend, divisor) {
	var quotient = (dividend / divisor);
	return Math.round(100*(quotient.toFixed(4)));
}

