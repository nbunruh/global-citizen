var APP = (function (app) {

  var database = app.database;
  var markers = [];

  function renderPlaceCell(place, jqueryElemObj) {
    var starRating = $('<span>').rateYo({
      rating: place.rating,
      starWidth: "18px",
      readOnly: true
    });

    var placeElem = $('<li class="media">').data('place-id', place.place_id).data('place-name', place.name)
      .append(
        $('<div class="media-left">')
          .append(
            $('<a >')
              .append(
                $('<img class="media-object">').attr('src', place.photos ? place.photos[0].getUrl({
                    'maxWidth': 80,
                    'maxHeight': 80
                  }) : 'assets/images/default100.jpg')
              )
          )
      )
      .append(
        $('<div class="media-body">')
          .append(
            $('<h4 class="media-heading place-title">').text(typeof place.idx === 'number' ? (place.idx + 1 + ". ") + place.name : place.name)
            // $('<h4 class="media-heading place-title">').text(place.idx + 1 + ". " + place.name).data('place-id', place.place_id).data('place-name', place.name)
          )
          .append(starRating)
          .append($('<p>').text(place.formatted_address))
          .append($('<p>').text(place.formatted_phone_number ? 'Phone#: ' + place.formatted_phone_number: ''))
          .append($('<p>').text(place.website ? 'Website URL: ' + place.website : ''))
      );

    jqueryElemObj.append(placeElem);
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
        console.log(result);
        infoWindow.setContent('<span style="color: black">' + result.name + '</span>');
        infoWindow.open(app.map, marker);
        console.log(place.name);
        showDetailsModal(place.place_id, place.name);
      });
    });
  }

  function clearPlaceListAndMarkers() {
    $('#place-list').empty();
    markers.forEach(function (marker) {
      marker.setMap(null);
    });

  }

  function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ' ' + year;
  }


  function showDetailsModal(placeId, placeName) {
    app.service.getDetails({
      placeId: placeId
    }, function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }

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
          $('<p>').text('Review: ' + place.reviews[0].text)
        )
        .append(
          $('<p>').text('Phone Number: ' + place.international_phone_number)
        )
        .append(
          $('<p>').text('Website: ' + place.url)
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

    var events = [
      {id: 103, name: "Music"},
      {id: 101, name: "Business"},
      {id: 110, name: "Food & Drink"},
      {id: 113, name: "Culture"},
      {id: 105, name: "Arts"},
      {id: 104, name: "Film & Media"},
      {id: 108, name: "Sports & Fitness"},
      {id: 107, name: "Health"},
      {id: 102, name: "Science & Tech"},
      {id: 109, name: "Travel & Outdoor"},
      {id: 115, name: "Family & Education"},
      {id: 116, name: "Holiday"},
      {id: 106, name: "Fashion"},
      {id: 119, name: "Hobbies"}
    ];
    events.forEach(function (event) {
      var eventText = event.name;
      var optionEl = $('<option>').val(event.id).text(eventText);
      if (event.id === 103) optionEl.prop('selected', true); //Music
      $('#event-select').append(optionEl);
    });

  }

  function renderUserUI(user) {
    hideLoginModal();
    $('#sign-in').hide();
    $('#sign-out').css({
      display: 'block'
    });
    $('#user-photo').append(
      $('<img id="user-thumbnail">').attr('src', user.photoURL ? user.photoURL : 'assets/images/defaultUser.png')
    );
    $('#user-name').text(user.name);
    hideLoadingCircle();
  }

  function renderGuestUI() {
    $('#sign-in').show();
    $('#sign-out').hide();
    $('#user-photo').empty();
    $('#user-name').text('');
  }

  function showLoginModal() {
    $('#login-modal').modal('show');
  }

  function hideLoginModal() {
    $('#login-modal').modal('hide');
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
    modal.modal('show');

    var favoritePlaces = $('#favorite-places').empty();

    database.ref('users/' + user.uid + '/favorite_places').once('value')
      .then(function (placesSnap) {
        //if user has saved places
        if (placesSnap.exists()) {
          var places = placesSnap.val();
          Object.keys(places).forEach(function (key) {
            var collapse = $('<div class="panel panel-green">')
              .append(
                $('<div class="panel-heading">')
                  .append(
                    $('<h5 class="panel-title place-title">').data('place-id', key)
                      .append(
                        $('<a class="collapsed" data-toggle="collapse" data-parent="#favorite-places">')
                          .attr('href', '#' + key)
                          .attr('aria-expanded', false)
                          .attr('aria-controls', key)
                          .text(places[key])
                      )
                  )
              )
              .append(
                $('<div class="panel-collapse collapse">').attr('id', key)
                  .append(
                    $('<div class="panel-body">')
                  )

              );

            favoritePlaces.append(collapse);
          });
        } else { //if user doesn't have save places
          favoritePlaces.append($('<li>').text("You don't have any saved place."));
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

  function renderEventCell(event) {
    var imgEl = $('<img class="media-object">')
      .attr('src', event.logo ? event.logo.original.url : 'assets/images/default100.jpg');
    var anchorEl = $('<a>');
    var mediaLeft = $('<div class="media-left">');

    anchorEl.append(imgEl);
    mediaLeft.append(anchorEl);


    var mediaBody = $('<div class="media-body">');
    var titleEl = $('<h5 class="media-heading place-title">').text(event.name.text);
    var descEl = $('<p>').text(formatDate(new Date(event.start.utc)));

    mediaBody.append(titleEl).append(descEl);

    var eventElem = $('<li class="media">');

    eventElem.append(mediaLeft).append(mediaBody);

    $('#event-list').append(eventElem);


  }

  function renderExpandedPlaceDetails(placeId) {
    app.service.getDetails({
      placeId: placeId
    }, function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      //add place information to expanded panel body
      var panelBodyEl = $('#' + placeId).find('.panel-body').empty();
      var starRatingEl = $('<span>').rateYo({
        rating: place.rating,
        starWidth: "18px",
        readOnly: true
      });
      renderPlaceCell(place, panelBodyEl);

    });
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
  app.renderPlaceCell = renderPlaceCell;
  app.addMarker = addMarker;
  app.clearPlaceListAndMarkers = clearPlaceListAndMarkers;
  app.showDetailsModal = showDetailsModal;
  app.showLoginModal = showLoginModal;
  app.hideLoginModal = hideLoginModal;
  app.replaceClass = replaceClass;
  app.showUserProfileModal = showUserProfileModal;
  app.renderExpandedPlaceDetails = renderExpandedPlaceDetails;
  app.showLoadingCircle = showLoadingCircle;
  app.hideLoadingCircle = hideLoadingCircle;
  app.renderEventCell = renderEventCell;
  return app;
}(APP || {}));
