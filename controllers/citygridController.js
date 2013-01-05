var citygridAPI = require('../models/citygridModel');
var citygridParser = require('../models/citygridJSONParserModel');

var params, response;

// invokes citygrid API model to send GET requests using the box boundaries and stop search terms.
exports.GETStopsFromCityGrid = function(req, res) {
	response = res;
	citygridAPI.lookupStops(req, res, printData);	
};

// stopLoc is the formatted, google maps-ready data structure
var stopsWaypointFormat = [],
	stops = [];
// callback used whenever a result is returned from a single API get request
function printData(requestResponse, progressCounters, parameters) {
	params = parameters;
	
	// limit = criteria for qualifying json response, progress = % of requests done
	passToParser(requestResponse, getLimits(), progressCounters, callback);
}

function setLimits() {}

function getLimits() {
	// limits/requirements to qualify results, for future use
	var limits = {
		'max_distance': 5,
		'total_hits': 0,
	};

	return limits;
}

// pushes address into waypoint object array
function pushStopsIntoWaypoints(stopsArray) {
	for (var key in stopsArray) {
		stopsWaypointFormat.push({
			location: stopsArray[key],
			stopover: true
		});
		console.log('key/value: ' + key + ' / ' + stopsArray[key]);
	}
}

// after receives that single API result, sends to parser
function passToParser(requestResponse, limits, progress, callback) {
	citygridParser.parseJSON(requestResponse, limits, progress, callback);
}

// parser's callback
function callback(parsedlocation, progress) {
	// right now responseStatus just means that results' data exists, will update in future to include limits/requirements
	responseStatus = parsedlocation.status;
	if(responseStatus == 'OK') {
		addToStopsDict(parsedlocation);
	} else if(responseStatus == 'EMPTY') {
		// do nothing yet
	}
	if((progress.request_counter*100)/(progress.total_requests) == 100) {
		renderDirections();
	}
}

function renderDirections() {
	pushStopsIntoWaypoints(stops);
	response.render('map', { title: 'RouteStop', start: params.start, end: params.end, stops: JSON.stringify(stopsWaypointFormat) });
}

function printDict(dict) {
	for (var key in dict) {
		console.log('stopsFormattedArray: ' + key + ' / ' + dict[key]);
	}
}

// makes sure only one of each stop type is stored in stops array
function addToStopsDict(location) {
	if(!(location.key in stops)) {
		stops[location.key] = location.name + ' ' + location.address.full_address;
	}
}



