var citygridAPI = require('../models/citygridModel');
var citygridParser = require('../models/citygridJSONParserModel');

var params, apiProgress, response;

var limits = {
	'max_distance': 5,
	'total_hits': 0,
};

// invokes citygrid API model to send GET requests using the box boundaries and stop search terms.
exports.GETStopsFromCityGrid = function(req, res) {
	response = res;
	citygridAPI.lookupStops(req, res, printData);	
};

// stopLoc is the formatted, google maps-ready data structure
var stopLoc = [],
	stops = [];
// callback used whenever a result is returned from a single API get request
function printData(data, request_counter, total_requests, parameters) {
	params = parameters;
	// apiProgress = ((request_counter*100) / total_requests);

	var progress =  {
		'request_counter': request_counter,
		'total_requests': total_requests
	};
	
	// data = json response, limit = criteria for qualifying json response, progress = % of requests done
	passToParser(data, limits, progress, callback);
}

function pushStopsIntoWaypoints(stopsArray) {
	for (var key in stopsArray) {
		stopLoc.push({
			location: stopsArray[key],
			stopover: true
		});
		console.log('key/value: ' + key + ' / ' + stopsArray[key]);
	}
}

// after receives that single API result, sends to parser
function passToParser(data, limits, progress, callback) {
	citygridParser.parseJSON(data, limits, progress, callback);
}

// parser's callback
function callback(isValid, parsedlocation, progress) {

	if(isValid) {
		addToStopsDict(parsedlocation);
	}
	if((progress.request_counter*100)/(progress.total_requests) == 100) {
		renderDirections();
	}
}

function addToStopsDict(location) {
	if(!(location.key in stops)) {
		stops[location.key] = location.full_address;
		console.log('HERE!!!');
	}
	console.log('stops length: ' + stops.length);
}

function renderDirections() {
	pushStopsIntoWaypoints(stops);
	response.render('map', { title: 'RouteStop', start: params.start, end: params.end, stops: JSON.stringify(stopLoc) });
}

