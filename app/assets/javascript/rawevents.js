/**
 * Created by hanifa on 3/14/17.
 */
// function EventManager(eventLocation) {
//     this.eventType = "Concerts";
//     this.eventLocation = eventLocation;//"San Diego";
// }

var APP = function(app) {

  var selectedLocation = {};
  var selectedCategory = 103;
  app.evenApiCaller = function(location, category) {
    app.showLoadingCircle();
    if(!location) location = selectedLocation;
    selectedLocation = location;
    if(!category) category = selectedCategory;
    selectedCategory = category;
    var settings = {
      // "async": true,
      "crossDomain": true,
      "url": "https://www.eventbriteapi.com/v3/events/search/?token=A3YIFUIZYR3KGGTZPZ2K",
      "method": "GET",
      "headers": {},
      data: {
        'location.latitude': location.lat,
        'location.longitude': location.lng,
        categories: category
      }
    };

    $.ajax(settings).done(function (data) {
      var evenHandler = data.events.splice(0,10);
      console.log(evenHandler);
      $('#event-list').empty();
      evenHandler.forEach(function (event,index) {
        app.renderEventCell(event);
        app.hideLoadingCircle();
      });


    })
  };

  return app;



}(APP || {});