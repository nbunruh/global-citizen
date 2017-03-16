/**
 * Created by hanifa on 3/14/17.
 */
// function EventManager(eventLocation) {
//     this.eventType = "Concerts";
//     this.eventLocation = eventLocation;//"San Diego";
// }

var APP = function(app) {
    app.evenApiCaller = function(lat, lng) {
        var queryURL = "http://eventful.com/json/events/search?";

        $.ajax({
            method: "GET",
            url: queryURL,
            dataType: 'jsonp',
            crossOrigin: true,
            data: {
                // q: 'Concerts',
                location: lat + "," + lng,
                api_key: '9p7B44XR8Qvc3jDK'
            }

        }).done(function (response) {
            var data = response.events.tabular.events;
            console.log(data);



        })
    };

    return app;



}(APP || {});