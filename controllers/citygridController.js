var citygridModel = require('../models/citygridModel');

exports.GETStopsFromCityGrid = function(req, res) {
	citygridModel.lookupStops(req, res, printData);
	res.render('map', { title: 'RouteStop' });
};

function printData(data, progressPercent) {
	console.log(data + ' ' + progressPercent);
}


/* @response: JSON response from citygrid places API
 * takes in citygrid api
 */
function parseJSONResponse(response) {
	var locations = jQuery.parseJSON(response);
	// check if there are any results immediately after parsing
	// if()
}

/* calculate distance between two lat long coords, used to ensure place 
 * of interest is within bounds, as citygrid will sometimes include 
 * the closest place of interest (within reason, e.g. 50 miles) even if it 
 * is outside the rectangular grid (of 5 miles)
 */
function calcDistance(lat1, lon1, lat2, lon2) {
	// uses spherical law of cosines from http://www.movable-type.co.uk/scripts/latlong.html
	var R = 3958.76; // miles
	return (Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
            Math.cos(lat1)*Math.cos(lat2) *
            Math.cos(lon2-lon1)) * R);
}