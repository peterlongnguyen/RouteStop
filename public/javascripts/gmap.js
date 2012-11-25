  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var markersArray = [];
  var resultsInEachBox = 1; // for dev purposes, how many results to show in each division box along the route
  var distance = 5; // km
  distance *= 1.60934; // conversion to km
  var infowindow; // used to know which one is currently open to close when another is opened
  var waypts = []; // stops along the way

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

  // adds waypoint from input box
  // function pushWaypoint() {
  //   var stop = document.getElementById('place').value;
  //   if(stop) waypts.push({
  //       location: stop,
  //       stopover: true
  //   });

  //   // clear stop input
  //   setElement('place', '');
  // }

  function pushWaypoint() {
    var stop = document.getElementById('place').value;
    $('#sortable').append('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + stop +'</li>');      

      // clear stop input
      setElement('place', '');  
  }

  function setElement(id, newValue) {
    document.getElementById(id).value = newValue;
  }

  function hasWaypoints() {
    return waypts.length > 0;
  }

  function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;

    // clear markers from maps
    clearOverlays();

    // var listItems = $("#sortable");
    // listItems.each(function(idx, li) {
    //     var product = $(li).val();
    //     alert(product);
    //     waypts.push(product);
    // });

    $('#sortable li').each(function(index) {
        var stopLoc = $(this).text();
        waypts.push({
          location: stopLoc,
          stopover: true
        });
    });
    
    if(hasWaypoints()) {
      var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: false, // does not optimize because list is user-ordered
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
        var stop = document.getElementById('place').value;
        var boxes = boxRoute(response);
         // alert(boxes.length);
         drawBoxes(boxes);

        for (var i = 0; i < boxes.length; i++) {
            var boundaries = boxes[i];
            // Perform search over this bounds

            var request = {
              keyword: stop,
              bounds: boundaries,
              // type: 'gas_station',
            };
            searchAlongRoute(request);
        }

        // var boxCounter = 0;
        // var timerID;
        // while(boxCounter < boxes.length) {
        //   // alert("boxCOunter:  " + boxCounter);
        //   // setTimeout( function() {
        //       var boundaries = boxes[boxCounter];
        //       var request = {
        //         keyword: stop,
        //         bounds: boundaries,
        //         // type: 'gas_station',
        //       };
        //      searchAlongRoute(request);
        //       boxCount++;
        //   // }, 200);
        // }

        directionsDisplay.setDirections(response);
        var route = response.routes[0];
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
      } else {
         alert('Finding route: ' + status);
      }
    });
    
    clearWaypoints();
  }

  // takes a response from google and creates rectangular boxes along the path
  function boxRoute(response) {
    var routeBoxer = new RouteBoxer();
    // Box the overview path of the first route
    var path = response.routes[0].overview_path;
    var boxes = routeBoxer.box(path, distance);

    return boxes;
  }

  // searches in one box along a route for queried terms
  function searchAlongRoute(request) {
    var service = new google.maps.places.PlacesService(map);
    // rate limit queries to 10 per second
    service.search(request, placeSearchCallback);
  }


  function placeSearchCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
        // customize how many results shown per box
        if(i+1 >= resultsInEachBox) break;
      }
    } else {
      alert('placeSearchCallback: ' + status);
    }
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

  // Draw the array of boxes as polylines on the map
  function drawBoxes(boxes) {
    boxpolys = new Array(boxes.length);
    for (var i = 0; i < boxes.length; i++) {
      boxpolys[i] = new google.maps.Rectangle({
        bounds: boxes[i],
        fillOpacity: 0,
        strokeOpacity: 1.0,
        strokeColor: '#000000',
        strokeWeight: 1,
        map: map
      });
    }
  }

  function foobar(el) { 
    setTimeout(function() { 
      foobar_cont(el); 
    }, 5000); 
  }

