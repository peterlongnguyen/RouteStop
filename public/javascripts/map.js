// data passed in from controller
var start = 'start default', 
    end = 'end default',
    waypts = new Array();

var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var map;

// initializes google maps with LA as the default center
function initialize() {
  var losangeles = new google.maps.LatLng(34.0522, -118.2428);
  var mapOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: losangeles
  }
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions_panel'));
}

/* A hack used to pass the waypoint locations: the object was being split
 * into an array of characters when express passed it to jade, so this 
 * function concatenates them and parses them as a JSON object back into 
 * a javascript object.
 */
function pushWaypoints() {
  var json = '';
  for(i = 0; i < waypts.length; i++) {
      json += waypts[i];
  }
  waypts = jQuery.parseJSON(json);
}

function hasWaypoints() {
  return waypts.length > 0;
}

function calcRoute() {
  pushWaypoints();
  
  if(hasWaypoints()) {
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true, // does not optimize because list is user-ordered
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  } else {
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  }

  // google API finds and maps route
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // variables used in searching stops along the way
      directionsDisplay.setDirections(response);

      var route = response.routes[0];
      var summaryPanel = document.getElementById("directions_panel");
      summaryPanel.innerHTML = "";
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i+1;
        summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
        summaryPanel.innerHTML += route.legs[i].start_address + " to ";
        summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
      }
    }
  });
}