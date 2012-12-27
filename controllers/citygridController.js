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
var stopLoc = [];
// callback used whenever a result is returned from a single API get request
function printData(data, progressPercent, parameters) {
	params = parameters;
	apiProgress = progressPercent;
	
	passToParser(data, limits, callback);

	// if(apiProgress == 100) {
	if(true) {
		apiStatus = APIState.DONE;
		// render should be at the end of parser callback

		var stop1 = "20238 Taft Highway Bakersfield, CA 93311";
		var stop2 = "33464 Bernard Drive Kettleman City, CA 93239";

		var stops = [stop1, stop2];

		pushStopsIntoWaypoints(stops);		

		response.render('map', { title: 'RouteStop', start: params.start, end: params.end, stops: JSON.stringify(stopLoc) });
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
function passToParser(data, limits, callback) {

	citygridParser.parseJSON(data, limits, callback);
}

// parser's callback
function callback() {

}

