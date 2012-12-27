/* @response: JSON response from citygrid places API
 * takes in citygrid api
 */
exports.parseJSON = function(data, limits, progress, callback) {
	var obj = JSON && JSON.parse(data.body) || $.parseJSON(data.body);
	var results = obj.results;

	var location = {
		'status': 'EMPTY',
		'key': '',
		'id': '',
		'street': '',
		'city': '',
		'state': '',
		'full_address' : '',
		'lat': '',
		'lng': ''
	 };
	
	if(results.total_hits == 0) { // || getDistance() > limits.max_distance) {
		return location; 
	} else {
		location.status = 'OK';
		var total_hits = results.total_hits,
			loc = results.locations[0];
		// extract search key from URI
		var uri = results.uri,
			key = uri.substring(uri.lastIndexOf('&what=')+6, uri.indexOf('&histograms'));

		if(loc) {
			var address = loc.address,

			location = {
				'status': 'OK',
				'key': key,
				'id': loc.id,
				'street': address.street,
				'city': address.city,
				'state': address.state,
				'full_address': '',
				'lat': loc.latitude,
				'lng': loc.longitude
			 };
			 location.full_address = location.street + ',' + location.city + ',' + location.state;

			// console.log('name: ' + name + ' lng: ' + lng + ' lat: ' + lat + ' state: ' + state + ' city: ' + city + ' street: ' + street);
			callback(true, location, progress);
		}	
	}
	callback(false, location, progress);
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