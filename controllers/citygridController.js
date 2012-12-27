var citygridAPI = require('../models/citygridModel');
var citygridParser = require('../models/citygridJSONParserModel');

var params, apiProgress, response;

var APIState = {
	'WORKING': 0, 
	'DONE': 1, 
};
var apiStatus = APIState.WORKING;

var parserState = {
	'WORKING': 0, 
	'DONE': 1 
};
var parserStatus = parserState.WORKING;

var limits = {
	'max_distance': 5,
	'total_hits': 0,
};

// invokes citygrid API model to send GET requests using the box boundaries and stop search terms.
exports.GETStopsFromCityGrid = function(req, res) {
	response = res;
	citygridAPI.lookupStops(req, res, printData);
	
};

// stores stops locations
// global.stopLoc = [];
// global.stops = [];
var stopLoc = [],
	stops = [];
// callback used whenever a result is returned from a single API get request
function printData(data, request_counter, total_requests, parameters) {
	params = parameters;
	apiProgress = ((request_counter*100) / total_requests);

	var progress =  {
		'request_counter': request_counter,
		'total_requests': total_requests
	};
	
	// data = json response, limit = criteria for qualifying json response, progress = % of requests done
	passToParser(data, limits, progress, callback);

	if(apiProgress == 1) {
	// if(true) {
		apiStatus = APIState.DONE;
		// render should be at the end of parser callback

		// var stop1 = "20238 Taft Highway Bakersfield, CA 93311";
		// var stop2 = "33464 Bernard Drive Kettleman City, CA 93239";

		// stops = [stop1, stop2];
		// console.log('stops0 length: ' + stops.length + ' stopsLoc length: ' + stopLoc.length);

		// pushStopsIntoWaypoints(stops);
		// 		console.log('stops1 length: ' + stops.length + ' stopsLoc length: ' + stopLoc.length);

	}
}

function pushStopsIntoWaypoints(stopsArray) {
	for(i = 0; i < stopsArray.length; i++) {
		stopLoc.push({
			location: stopsArray[i],
			stopover: true
		});
	}
}

// after receives that single API result, sends to parser
function passToParser(data, limits, progress, callback) {
	citygridParser.parseJSON(data, limits, progress, callback);
}

// parser's callback
function callback(isValid, parsedlocation, progress) {
	console.log('SECOND PROGRESS: ' + progress.request_counter/progress.total_requests);
			console.log('stops3 length: ' + stops.length + ' stopsLoc length: ' + stopLoc.length);

	if(isValid) {
		
	}
	if(progress.request_counter == 15 ) {
				var stop1 = "20238 Taft Highway Bakersfield, CA 93311";
				stops.push(stop1)
	}

	if( (progress.request_counter*100)/(progress.total_requests) == 100 ) {

		renderDirections();
	}
}

function renderDirections() {


		var stop2 = "33464 Bernard Drive Kettleman City, CA 93239";

		stops.push(stop2);

		pushStopsIntoWaypoints(stops);



	console.log('stops2 length: ' + stops.length + ' stopsLoc length: ' + stopLoc.length);
	response.render('map', { title: 'RouteStop', start: params.start, end: params.end, stops: JSON.stringify(stopLoc) });
}

