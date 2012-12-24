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

/* invokes citygrid API model to send GET requests using the box boundaries
 * and stop search terms.
 */
exports.GETStopsFromCityGrid = function(req, res) {
	response = res;
	citygridAPI.lookupStops(req, res, printData);
	
};

function printData(data, progressPercent, parameters) {
	// console.log(data + ' ' + progressPercent);
	params = parameters;
	apiProgress = progressPercent;
	
	passToParser(data, limits);

	// console.log('DATA: ' + data);
	if(apiProgress == 100) {
		apiStatus = APIState.DONE;
		response.render('map', { title: 'RouteStop', start: params.start , end: params.end });
	}
}

function passToParser(data, limits) {

	citygridParser.parseJSON(data, limits, callback);
}

function callback() {

}

