// data passed in from controller
var start = 'start default', 
    end = 'end default',
    waypts = new Array(),
    names = [];

var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var map;

// initializes google maps with LA as the default center
function initialize() {
  var losangeles = new google.maps.LatLng(34.0522, -118.2428),
      mapDiv = 'map_canvas';

  // var layer = 'watercolor';
  // map = new google.maps.Map(document.getElementById(mapDiv), {
  //     center: losangeles,
  //     zoom: 8,
  //     mapTypeId: layer,
  //     mapTypeControlOptions: {
  //         mapTypeIds: [layer]
  //     }
  // });
  // map.mapTypes.set(layer, new google.maps.StamenMapType(layer));

  var mapOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: losangeles
  }
  map = new google.maps.Map(document.getElementById(mapDiv), mapOptions);

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
  retrieveLocationName(waypts, names);
  console.log('final loc: ' + waypts[0].location);
}

// extracts name from location, storing the key pair in associative array 'name'
function retrieveLocationName(arr, nameArr) {
  for (var i = 0; i < arr.length; i++) {
    var address = arr[i].location;
    var index = address.indexOf('*/');

    if(index == -1) {
      // if it's just a regular address, the address will be both key and value
      nameArr[address] = address;
    } else {
      // remove the name portion from the address (e.g. remove 'In-n-out burger*/')
      var name = address.substring(0, index);
      address = address.substring(index+2);
      nameArr[address] = name;
      arr[i].location = address;
    }
  }
}

function returnEmptyStringIfFalsy(str) {
  return ( (str) ? (str + ' ') : ('') );
}

/* tries to match up the address google uses (which is altered by google) to one stored in 
 * the names array to figure out the name of the waypoint (e.g. restaurant name). 
 * uses levenshtein formula, properly accredited in levenshtein.js 
 */
function getName(address) {
  for(var key in names) {
    // returns if the addresses have a 50% match
    if( ( (1.0) * (levenshteinenator(address, key)/address.length) ) <= 0.5 && !isOnlyAnAdress(key) ) {
      return ( '<b>' + names[key] + '</b>, ' );
    }
  }
  return ('');
}

// names of destinations are separated from addresses by */ pattern, whereas pure addresses have no name
function isOnlyAnAdress(waypt) {
  return waypt.indexOf('*/') == -1;
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
      var waypoint_order = route.waypoint_order;
      var summaryPanel = document.getElementById("directions_panel");
      summaryPanel.innerHTML = "";
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var waypt = ( waypoint_order[i] ) ? (waypoint_order[i] + ' ') : ('');
        var routeSegment = i+1;
        summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
        summaryPanel.innerHTML += getName(route.legs[i].start_address) + route.legs[i].start_address + " to ";
        summaryPanel.innerHTML += getName(route.legs[i].end_address) + route.legs[i].end_address + "<br />";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
      }
    }
  });
}