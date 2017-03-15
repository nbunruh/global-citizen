var APP = (function(app){
  var mapView = app.mapView = {}; 

  var autocomplete;
  // var componentForm = {
  //   street_number: 'short_name',
  //   route: 'long_name',
  //   locality: 'long_name',
  //   administrative_area_level_1: 'short_name',
  //   country: 'long_name',
  //   postal_code: 'short_name'
  // };
  var database = firebase.database(); // User favorite places???

  mapView.initAutocomplete = function() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')), {
        types: ['geocode']
      });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', getAddress);

    //At first show San Diego Map
    initMap(32.715738, -117.1610838);

  };

  function getAddress() {
    var place = autocomplete.getPlace().geometry.location;
    console.log(place);
    console.log(place.lat(), place.lng());
    initMap(place.lat(), place.lng());
    // getPlaces(place.lat()+ "," + place.lng());



  }

  function initMap(lat, lng) {
    app.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: lat,
        lng: lng
      },
      zoom: 13,
      styles: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#523735"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#c9b2a6"
          }]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#dcd2be"
          }]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ae9e90"
          }]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#93817c"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#a5b076"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#447530"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#fdfcf8"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f8c967"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#e9bc62"
          }]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e98d58"
          }]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#db8555"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#806b63"
          }]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8f7d77"
          }]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#b9d3c2"
          }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#92998d"
          }]
        }
      ]
    });

    app.service = new google.maps.places.PlacesService(app.map);

    // The idle event is a debounced event, so we can query & listen without
    // throwing too many requests at the server.
    app.map.addListener('idle', function () {
      performSearch(lat, lng);
      eventSearch(lat, lng);
    });
  }

  function performSearch(lat, lng) {

    app.clearPlaceList();
    // var request = {
    //   bounds: map.getBounds(),
    //   radius: 10000,
    //     type: "museum"
    // };
    var request = {
      query: "best places",
      location: new google.maps.LatLng(lat, lng),
      radius: 30000,
      type: "museum"
    };
    // service.radarSearch(request, callback);
    // service.radarSearch(request, callback);
    app.service.textSearch(request, afterSearch);

  }

  function afterSearch(results, status) {
    console.log(results);
    var tenResults = results.slice(0, 10);
    tenResults.forEach(function(place, idx) {
      const placeData = {
        name: place.name,
        address: place.formatted_address,
        photo: place.photos ? place.photos[0].getUrl({
          'maxWidth': 80,
          'maxHeight': 80
        }) : 'assets/images/default100.jpg',
        rating: place.rating,
        // opening_hours: place.opening_hours,
        icon: place.icon,
        place_id: place.place_id,
        types: place.types,
        idx: idx
      };

      app.renderPlaceList(placeData);
      app.addMarker(place, idx);


    });
    // if (status !== google.maps.places.PlacesServiceStatus.OK) {
    //   console.error(status);
    //   return;
    // }
    // for (var i = 0, result; result = results[i]; i++) {
    //   app.addMarker(result, map);
    // }
  }

/** TODO:
 * 1. map center point
 * 2. getDetails
 * 3. when user click marker or media-object, modal function call
 *
 */

  return app;


})(APP || {});