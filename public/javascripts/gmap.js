
$(function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
});

var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markersArray = [];
var resultsInEachBox = 1; // for dev purposes, how many results to show in each division box along the route
var distance = 5; // km
distance *= 1.60934; // conversion to km, which google uses as default
var infowindow; // used to know which one is currently open to close when another is opened
var waypts = []; // stops along the way

function reset() {
  clearWaypoints();
}

// initializes google maps with LA as the default center
function initialize() {
  reset();
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

// visually adds the waypoint to the list on the frontend, no backend happens
function pushWaypoint() {
  var stop = document.getElementById('place').value;
  $('#sortable').append('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + stop +'</li>');      

    // clear stop input
    setElement('place', '');  
}

function setElement(id, newValue) {
  document.getElementById(id).value = newValue;
}

// converts stops list into input list to POST to controller
function processStops() {
  $('#sortable li').each(function(index) {
      var stopLoc = $(this).text();
      $('#sortable').append('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + stop +'</li>');
  });
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;

  // adds each list element as a stop
  $('#sortable li').each(function(index) {
      var stopLoc = $(this).text();
      waypts.push(stopLoc);
  });
  
  // request to find google maps route, which will be boxed
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // variables used in searching stops along the way
      var routeResponse = response;
      var boxes = boxRoute(response);
      var stops = jQuery.extend(true, [], waypts);

      var directions = [];
      for (var i = 0; i < boxes.length; i++) {
        var boundaries = boxes[i];
        // Perform search over this bounds

        // extract degree of each direction and push into directions array
        var N = boundaries.getNorthEast().lat().toString();
        var S = boundaries.getSouthWest().lat().toString();
        var E = boundaries.getNorthEast().lng().toString();
        var W = boundaries.getSouthWest().lng().toString();

        directions.push({
          'N': N,
          'S': S,
          'E': E,
          'W': W
        });
      }

      var params = {
        'waypts': stops,
        'boxes': directions,
        'route': routeResponse,
        'start': start,
        'end': end
      };

      // convert boxes, stops, and route to JSON and insert back into form to submit
      var placesData = JSON.stringify(params);
      document.getElementById('params').value = placesData;
      document.getElementById("route").submit();

    } else {
       // alert('Finding route: ' + status);
    }
  });        
}

// takes a response (route) from google and creates rectangular boxes along the path
function boxRoute(response) {
  var routeBoxer = new RouteBoxer();
  // Box the overview path of the first route
  var path = response.routes[0].overview_path;
  var boxes = routeBoxer.box(path, distance);

  return boxes;
}

function clearWaypoints() {
  waypts.length = 0;
}
