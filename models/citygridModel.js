/* receives a route of boxes and list of places to look up for each box, returning closest match */

var request = require('request');

exports.lookupStops = function(req, res, callback){
	// console.log("testing passing variables: " + req.body.params);
	var params = JSON.parse(req.body.params);
	var boxes = params.boxes;
	var waypts = params.waypts;
	console.log('boxes: ' + boxes.length + ' waypts: ' + waypts.length);
	var start_time = new Date().getTime();

	var   request_counter = 0
		, total_requests = (boxes.length * waypts.length); 

	// loop through all boxes along path
	for(var i = 0; i < boxes.length; i++) {
		var boundaries = boxes[i];
        // Perform search over this bounds

        // get coordinate of each direction
        var N = boundaries.N;
        var S = boundaries.S;
        var E = boundaries.E;
        var W = boundaries.W;

        console.log('Directions: ' + N + ' ' + S + ' ' + E + ' ' + W);

        // loop again and search for every waypoint
        for(var j = 0; j < waypts.length; j++) {

        	console.log('waypoint: ' + waypts[j]);
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
				if (!error && response.statusCode == 200) {
					// console.log(body) // Print the google web page.
					callback(body, requests_progress_pct);
					
					var end_time = new Date().getTime();
					var time = end_time - start_time;
					console.log((time/1000) + ' seconds');
				}
				request_counter++;
				var requests_progress_pct = getPercent(request_counter, total_requests);
				console.log(requests_progress_pct + '%');

				// continues ahead after last callback
				// @todo: need to check data integrity, especiall if errorcode
				if(request_counter == (total_requests)) {
					console.log(" why hello there again!!");
				}
			})
		}
	}
};

/* rounds from two decimal places of percent
 */
function getPercent(dividend, divisor) {
	var quotient = (dividend / divisor);
	return Math.round(100*(quotient.toFixed(4)));
}

