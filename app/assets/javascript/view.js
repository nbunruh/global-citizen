var APP = (function (app) {

  var database = app.database;
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
            $('<img class="media-object">').attr('src', 'assets/images/default100.jpg')
          )
        )
      )
      .append(
        $('<div class="media-body">')
        .append(
          $('<h4 class="media-heading place-title">').text(place.idx + 1 + ". " + place.name).data('place-id', place.place_id).data('place-name', place.name)
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
        showDetails(place.place_id, place.name);
      });
    });
  }

  function clearPlaceListAndMarkers() {
    $('#place-list').empty();
    markers.forEach(function (marker) {
      marker.setMap(null);
    });

  }

  function showDetails(placeId, placeName) {
    app.service.getDetails({
      placeId: placeId
    }, function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      console.log(place);

      var starElement = $('<i class="glyphicon favorite glyphicon-star-empty">').data('place-id', placeId).data('place-name', placeName);
      //check if user has saved this place as favorite before
      if (app.user) {
        database.ref('users/' + app.user.uid + '/favorite_places/' + placeId).once('value')
          .then(function (placeSnap) {
            //if user has saved before
            if (placeSnap.exists()) app.replaceClass(starElement, 'glyphicon-star-empty', 'glyphicon-star');
          })
      }
      var detailsModal = $('#detailsModal');
      //remove previous details info
      detailsModal.find('.modal-body').empty();

      detailsModal.modal('show');
      detailsModal.find('.modal-title').text(place.name + ' ').append(starElement);
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
      var placeText = (place.charAt(0).toUpperCase() + place.slice(1)).replace('_', ' ');
      var optionEl = $('<option>').val(place).text(placeText);
      if (place === 'park') optionEl.prop('selected', true);
      $('#place-select').append(optionEl);
    });

  }

  function renderUserUI(user) {
    $('#openLoginModal').hide();
    $('#sign-out').css({
      display: 'block'
    });
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

  function showLoginModal() {
    $('#login-modal').modal('show');
  }

  function replaceClass(elem, oldClass, newClass) {
    $(elem).removeClass(oldClass).addClass(newClass);
  }

  function showUserProfileModal() {
    var modal = $('#user-profile-modal');
    var user = app.user;
    $('#profile-image').attr('src', user.photoURL);
    $('#profile-name').text(user.name);
    $('#profile-email').text(user.email);
    // $('#user-profile-modal').find('.modal-body')
    //   .append($('<p>').text('Email: ' + user.email));
    modal.modal('show');

    var favoritePlaces = $('#favorite-places').empty();


    database.ref('users/' + user.uid + '/favorite_places').once('value')
      .then(function (placesSnap) {
        //if user has saved places
        if (placesSnap.exists()) {
          var places = placesSnap.val();
          Object.keys(places).forEach(function (key, idx) {
            var num = idx + 1;
            favoritePlaces.append($('<p>').text(num + '. ' + places[key]));
          });
        } else { //if user doesn't have save places
          favoritePlaces.append($('<p>').text("You don't have any saved place."));
        }

        // $('#user-profile-modal').find('.modal-body')
        //   .append(favoritePlaces);
      });
  }

    function appendEventToView(place) {

        var placeElemv = $('<li class=" innermodal" style="height: auto">');
        var header = $("<h6 style='color: red;  text-align: center;font-size: 12px'>");
        var body = $("<div style='background-color: white;padding: 5px ;font-size: 8px;overflow: auto'>");
        var imgL = $("<img src='"+place.logo.original.url+"' width='200' height='100' style='float: left; margin-right:5px ;margin-bottom:5px'>");
        var footer =$("<footer style='; color: white; text-align: center; font-size: 10px; margin: 5px;margin-left: 5px'> ");

        header.append(place.name.text);
        body.append(imgL);
        body.append(place.description.text)
        footer.append(place.start.local);

        placeElemv.append(header)
            .append(body)
            .append(footer)

        $('#event-list').append(placeElemv);

    }

    function showLoadingCircle () {
      $('#loading-wrapper').css('display', 'block');
    }

    function hideLoadingCircle () {
      $('#loading-wrapper').css('display', 'none');
    }

  app.appendEventToView = appendEventToView;
  app.renderUserUI = renderUserUI;
  app.renderGuestUI = renderGuestUI;
  app.initializeView = initializeView;
  app.renderPlaceList = renderPlaceList;
  app.addMarker = addMarker;
  app.clearPlaceListAndMarkers = clearPlaceListAndMarkers;
  app.showDetails = showDetails;
  app.showLoginModal = showLoginModal;
  app.replaceClass = replaceClass;
  app.showUserProfileModal = showUserProfileModal;
  app.showLoadingCircle = showLoadingCircle
  app.hideLoadingCircle = hideLoadingCircle;

  return app;
}(APP || {}));
