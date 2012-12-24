

var location = {
	'status': 'EMPTY',
	'address': '',
	'city': '',
	'state': '',
	'lat': '',
	'lng': ''
 };

/* @response: JSON response from citygrid places API
 * takes in citygrid api
 */
exports.parseJSON = function(json, limits, callback) {
	var obj = JSON && JSON.parse(json) || $.parseJSON(json);
	var results = obj.results;
	
	// if(results.total_hits < limits.total_hits || getDistance() > limits.max_distance) {
	if(1 + 1 == 3) {
		return location; 
	} else {
		location.status = 'OK';
		var total_hits = results.total_hits,
			address = results.locations[0];

		// loc = results.locations[0];
		// console.log(loc.0);

		// var
		// 	street = address.street,
		// 	city = address.city, 
		// 	state = address.state,
		// 	lat = results.latitude,
		// 	lng = results.longitude
		// 	;
			
		// 	console.log('lng: ' + lng + ' lat: ' + lat + ' state: ' + state + ' city: ' + city + ' street: ' + street);
	}

	console.log('TOTAL HITS: ' + total_hits);
	return location;
}

/* calculate distance between two lat long coords, used to ensure place 
 * of interest is within bounds, as citygrid will sometimes include 
 * the closest place of interest (within reason, e.g. 50 miles) even if it 
 * is outside the rectangular grid (of 5 miles)
 */
function getDistance(lat1, lon1, lat2, lon2) {
	// uses spherical law of cosines from http://www.movable-type.co.uk/scripts/latlong.html
	var R = 3958.76; // miles
	return (Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
            Math.cos(lat1)*Math.cos(lat2) *
            Math.cos(lon2-lon1)) * R);
}

// start from center and work outwards
function traverseFromCenter(arr) {
	var center = Math.floor(arr.length/2) - 1;
	var index_right = center, index_left = center;
	var objLeft, objRight, objCenter;
	for(i = 0; i < arr.length/2; i++) {

		objCenter = arr[center];

		if(index_right < arr.length-1) {
			index_right++;
			objRight = arr[index_right]; 
			// should this json object on the spot here
		}			

		if(index_left > 0) {
			index_left--;
			objLeft = arr[index_left];
			// should this json object on the spot here
		}

		console.log(objRight + " " + objLeft + " " + objCenter);
	}
}