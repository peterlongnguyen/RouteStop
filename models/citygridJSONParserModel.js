

/* @response: JSON response from citygrid places API
 * takes in citygrid api
 */
exports.parseJSON = function(requestResponse, limits, progress, callback) {
	// get JSON response object from citygrid API
	var parsedJSON = getParsedJSON(requestResponse.JSONdata),
		results = parsedJSON.results,
		total_hits = results.total_hits,
		location;

	if(total_hits) {
		var loc = getLocations(results);

		// checks if there are any results for that waypoint in that box boundary
		if(loc) {
			var address = loc.address,
				key = getSearchKeyFromURI(results.uri);
			
			location = {
				'status': 'OK',
				'key': key,
				'id': loc.id,
				'name': loc.name,
				'address': getAddressArray(address),
				'lat': loc.latitude,
				'lng': loc.longitude
			};
		}	 
	} else {
		location = {
			'status': 'EMPTY',
		};
	}
	callback(location, progress);
}

// currently only retrieves first location
function getLocations(results) {
	return results.locations[0];
}

function getParsedJSON(json) {
	return ( JSON && JSON.parse(json) || $.parseJSON(json) );
}

function getAddressArray(address) {
	var addr = {
		'street': address.street,
		'city': address.city,
		'state': address.state,
		'postal_code': address.postal_code,
		'full_address': getFullAddress(address),
	}

	return addr;
}

function getFullAddress(address) {
	return ( address.street + ', ' + address.city + ', ' + address.state + ', ' + address.postal_code + ', USA' );
}

function getSearchKeyFromURI(uri) {
	// +6 to start at the end of the string '&what='
	return ( uri.substring(uri.lastIndexOf('&what=')+6, uri.indexOf('&histograms')) );	
}

// function getOriginLatLngFromURI(uri) {
// 	var lat = uri.substring(uri.lastIndexOf('&what=')+6, uri.indexOf('&histograms'))
// 	return 
// }

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

// start from center and work outwards, will use in future to space out stops
function traverseFromCenter(arr) {
	var center = Math.floor(arr.length/2) - 1;
	var index_right = center, index_left = center;
	var objLeft, objRight, objCenter;
	for(i = 0; i < arr.length/2; i++) {

		objCenter = arr[center];

		if(index_right < arr.length-1) {
			index_right++;
			objRight = arr[index_right]; 
			// should parse json object on the spot 
		}			

		if(index_left > 0) {
			index_left--;
			objLeft = arr[index_left];
			// should parse json object on the spot
		}

		console.log(objRight + " " + objLeft + " " + objCenter);
	}
}