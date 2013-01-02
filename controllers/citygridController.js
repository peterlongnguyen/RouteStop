var citygridAPI = require('../models/citygridModel');
var citygridParser = require('../models/citygridJSONParserModel');

var params, response;

// invokes citygrid API model to send GET requests using the box boundaries and stop search terms.
exports.GETStopsFromCityGrid = function(req, res) {
	response = res;
	citygridAPI.lookupStops(req, res, printData);	
};

// limits/requirements to qualify results, for future use
var limits = {
	'max_distance': 5,
	'total_hits': 0,
};
// stopLoc is the formatted, google maps-ready data structure
var stopsWaypointFormat = [],
	stops = [];
// callback used whenever a result is returned from a single API get request
function printData(requestResponse, request_counter, total_requests, parameters) {
	params = parameters;

	var progress =  {
		'request_counter': request_counter,
		'total_requests': total_requests
	};
	
	// limit = criteria for qualifying json response, progress = % of requests done
	passToParser(requestResponse, limits, progress, callback);
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
function callback(isValid, parsedlocation, progress) {
	// right now isValid just means that results' data exists, will update in future to include limits/requirements
	if(isValid) {
		addToStopsDict(parsedlocation);
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
		stops[location.key] = location.full_address;
	}
}



