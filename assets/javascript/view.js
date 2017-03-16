var APP = (function (app) {

  var markers = [];

  function renderPlaceList(place) {
    var starRating = $('<span>').rateYo({
      rating: place.rating,
      starWidth: "18px",
      readOnly: true
    });

    var placeElem = $('<li class="media">')
      .append(
        $('<div class="media-left">')
        .append(
          $('<a href="#">')
          .append(
            $('<img class="media-object">').attr('src', place.photo)
          )
        )
      )
      .append(
        $('<div class="media-body">')
        .append(
          $('<h4 class="media-heading place-title">').text(place.idx + 1 + ". " + place.name).data('id', place.place_id)
        )
        .append(starRating)
        .append(
          $('<p>').text(place.address)
        )
      );

    $('#place-list').append(placeElem);
  }

  function addMarker(place, idx) {
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      label: (idx + 1) + "",
      map: app.map,
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    });

    //save markers in the array
    markers.push(marker);

    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
      app.service.getDetails(place, function (result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        infoWindow.setContent(result.name);
        infoWindow.open(app.map, marker);
        showDetails(place.place_id);
      });
    });
  }

  function clearPlaceListAndMarkers() {
    $('#place-list').empty();
    markers.forEach(function(marker) {
      marker.setMap(null);
    });

  }

  function showDetails(placeId) {
    app.service.getDetails({
      placeId: placeId
    }, function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }

      var detailsModal = $('#detailsModal');
      detailsModal.modal('show');
      detailsModal.find('.modal-title').text(place.name);
      detailsModal.find('.modal-body')
        .append(
          $('<p>').text('Address: ' + place.formatted_address)
        )
        .append(
          $('<p>').text('review: ' + place.reviews[0].text)
        )
        .append(
          $('<p>').text('Phone#: ' + place.international_phone_number)
        )
        .append(
          $('<p>').text('Website URL: ' + place.url)
        );
    });
  }

  function initializeView() {
    var places = ["airport",
      "amusement_park",
      "art_gallery",
      "bar",
      "bus_station",
      "cafe",
      "campground",
      "car_rental",
      "casino",
      "department_store",
      "gas_station",
      "hospital",
      "library",
      "liquor_store",
      "movie_theater",
      "museum",
      "night_club",
      "park",
      "parking",
      "police",
      "post_office",
      "restaurant",
      "school",
      "shopping_mall",
      "spa",
      "stadium",
      "subway_station",
      "train_station",
      "transit_station",
      "travel_agency",
      "university",
      "zoo"
    ];
    places.forEach(function (place) {
      var optionEl = $('<option>').val(place).text(place.charAt(0).toUpperCase() + place.slice(1));
      if(place === 'park') optionEl.prop('selected', true);
      $('#place-select').append(optionEl);      
    });
    
  }

  function renderUserUI(user) {
    $('#openLoginModal').hide();
    $('#sign-out').css({display: 'block'});
    $('#user-photo').append(
      $('<img id="user-thumbnail">').attr('src', user.photoURL ? user.photoURL : 'assets/images/defaultUser.png')
    );
    $('#user-name').text(user.name);
    var loginModal = $('#login-modal');
    loginModal.modal('hide');
  }

  function renderGuestUI() {
    $('#openLoginModal').show();
    $('#sign-out').hide();
    $('#user-photo').empty();
    $('#user-name').text('');
  }



  app.renderUserUI = renderUserUI;
  app.renderGuestUI = renderGuestUI;

  app.initializeView = initializeView;
  app.renderPlaceList = renderPlaceList;
  app.addMarker = addMarker;
  app.clearPlaceListAndMarkers = clearPlaceListAndMarkers;
  app.showDetails = showDetails;
  return app;
}(APP || {}));
