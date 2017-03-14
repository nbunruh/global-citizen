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
            $('<h4 class="media-heading">').text(place.idx + 1 + ". " + place.name)
          )
          .append(starRating)
          .append(
            $('<p>').text(place.address)
          )
      );

    $('#placeList').append(placeElem);
  }

  function addMarker(place, idx, map, service) {
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      label: (idx + 1) + "",
      map: map,
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    });

    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
      service.getDetails(place, function (result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        infoWindow.setContent(result.name);
        infoWindow.open(map, marker);

      });
    });
  }



  function clearPlaceList() {
    $('#placeList').remove('li.media');
  }


  app.renderPlaceList = renderPlaceList;
  app.addMarker = addMarker;
  app.clearPlaceList = clearPlaceList;
  return app;
}(APP || {}));
