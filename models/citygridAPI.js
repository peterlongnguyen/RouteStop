/* receives a route of boxes and list of places to look up for each box, returning closest match */

var request = require('request');

exports.lookupStops = function(req, res){
	console.log("testing passing variables: " + req.body.params);
	var params = JSON.parse(req.body.params);
	var boxes = params.boxes;
	var placeList = params.placeList;
	var start_time = new Date().getTime();

	// loop through all boxes
	for(var i = 0; i < boxes.length; i++) {
		var boundaries = boxes[i];
        // Perform search over this bounds

        // get coordinate of each direction
        var N = boundaries.getNorthEast().lat().toString();
        var S = boundaries.getSouthWest().lat().toString();
        var E = boundaries.getNorthEast().lng().toString();
        var W = boundaries.getSouthWest().lng().toString();

        // loop again and search every place
        for(var j = 0; j < placeList.length; j++) {

        	// GET request to citygrid to look up places
	        var request = 'http://api.citygridmedia.com/content/places/v2/search/latlon?format=json'
	        				+ '&what=' + placeList[i] 
	        				// + '&type=' +
	        				+ '&lat=' + N 
	        				+ '&lon=' + E 
	        				+ '&lat2=' + S 
	        				+ '&lon2=' + W 
	        				+ '&publisher=test';

			request(get_request, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					// console.log(body) // Print the google web page.
					var end_time = new Date().getTime();
					var time = end_time - start_time;
					console.log(time);
				}
			})
		}
	}

}