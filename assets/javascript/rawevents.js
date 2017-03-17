/**
 * Created by hanifa on 3/14/17.
 */
// function EventManager(eventLocation) {
//     this.eventType = "Concerts";
//     this.eventLocation = eventLocation;//"San Diego";
// }

var APP = function(app) {
    app.evenApiCaller = function(lat, lng) {
        var settings = {
            // "async": true,
            "crossDomain": true,
            "url": "https://www.eventbriteapi.com/v3/events/search/?token=A3YIFUIZYR3KGGTZPZ2K",
            "method": "GET",
            "headers": {}
        }

        $.ajax(settings).done(function (data) {
            var evenHandler = data.events.splice(0,5);
            evenHandler.forEach(function (event,index) {
            console.log(" THIS IS THE DATA"+evenHandler);
             app.appendEventToView(event)
            });


        })
    };

    return app;



}(APP || {});