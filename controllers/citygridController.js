var citygridAPI = require('../models/citygridModel');
var citygridParser = require('../models/citygridJSONParserModel');

var params, progress;

var limits = {
	'max_distance': 5,
	'total_hits': 0,
};

/* invokes citygrid API model to send GET requests using the box boundaries
 * and stop search terms.
 */
exports.GETStopsFromCityGrid = function(req, res) {
	citygridAPI.lookupStops(req, res, printData);
	if(progress == 100) {
		res.render('map', { title: 'RouteStop', start: params.start , end: params.end });
	}
};

function printData(data, progressPercent, parameters) {
	// console.log(data + ' ' + progressPercent);
	params = parameters;
	progress = progressPercent;
	citygridParser.parseJSON(data, limits);
	// console.log('DATA: ' + data);
}

