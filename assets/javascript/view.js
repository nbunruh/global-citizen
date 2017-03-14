var APP = (function (app) {

  function renderPlaceList(place) {

    var starRating = $('<span>').rateYo({rating: place.rating, starWidth: "18px", readOnly: true});

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

    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
      app.service.getDetails(place, function (result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        infoWindow.setContent(result.name);
        infoWindow.open(app.map, marker);

      });
    });
  }

  function clearPlaceList() {
    $('#placeList').remove('li.media');
  }

  function showDetails(placeId) {
    console.log(placeId);
    app.service.getDetails({ placeId: placeId }, function (place, status) {
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


  app.renderPlaceList = renderPlaceList;
  app.addMarker = addMarker;
  app.clearPlaceList = clearPlaceList;
  app.showDetails = showDetails;
  return app;
}(APP || {}));
