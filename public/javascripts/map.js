var start = 'start default', end = 'end default';

function check() {
  console.log("starting point: " + end);
}

var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markersArray = [];
var resultsInEachBox = 1; // for dev purposes, how many results to show in each division box along the route
var distance = 5; // km
distance *= 1.60934; // conversion to km, which google uses as default
var infowindow; // used to know which one is currently open to close when another is opened
var waypts = []; // stops along the way

// initializes google maps with LA as the default center
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var losangeles = new google.maps.LatLng(34.0522, -118.2428);
  var mapOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: losangeles
  }
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  // clear markers from maps
  clearOverlays();

  // adds each list element as a stop
  // $('#sortable li').each(function(index) {
  //     var stopLoc = $(this).text();
  //     waypts.push({
  //       location: stopLoc,
  //       stopover: true
  //     });
  // });
  
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

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // variables used in searching stops along the way

    }

    directionsDisplay.setDirections(response);
    var route = response.routes[0];
    var steps = response.steps[0];
    var summaryPanel = document.getElementById('directions_panel');
    summaryPanel.innerHTML = '';
    // For each route, display summary information.
    for (var i = 0; i < route.legs.length; i++) {
      var routeSegment = i + 1;
      summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
      summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
      summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
      summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
    }

    for(var i = 0; i < steps.step.length; i++) {
      summaryPanel.innerHTML += route.steps[i].html_instructions + '<br>';
    }
  });
  
  clearWaypoints();
}

function createMarker(place) {
  var pinColorRed = "FE7569";
  var pinColorGreen = "32CD32";
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColorGreen,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: pinImage,
    position: placeLoc,
    title: place.name
  });

  // store markers to delete on every new query
  markersArray.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    // if another info window is open, close it
    if(infowindow) infowindow.close();
    infowindow = new google.maps.InfoWindow({
      content: place.name
    });
    // infowindow.setContent(place.name);
    infowindow.open(map, marker);
  });
}

// helper to clear markers and empty out the array
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

function clearWaypoints() {
  waypts.length = 0;
}


function hasWaypoints() {
        return waypts.length > 0;
      }