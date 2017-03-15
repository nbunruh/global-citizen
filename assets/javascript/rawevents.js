/**
 * Created by hanifa on 3/14/17.
 */
function EventManager(){
    this.eventType = "Concerts";
    this.eventLocation = "San Diego";

    EventManager.prototype.evenApiCaller = function() {
        var queryURL = "http://eventful.com/json/events/search?q=Concerts&location=san+Diego&api_key=9p7B44XR8Qvc3jDK";

        $.ajax({
            method: "GET",
            url: queryURL,
            dataType: 'jsonp',
            crossOrigin: true

        }).done(function (response) {

            var data = response.events.tabular.events;

            var text1 = data[0].title;
            var text1a = data[0].rf_start_time;
            var text1b = data[0].price;
            var text1c = data[0].description;

            var text2 = data[1].title;
            var text2a = data[1].rf_start_time;
            var text2b = data[1].price;
            var text2c = data[1].description;

            var text3 = data[2].title;
            var text3a = data[2].rf_start_time;
            var text3b = data[2].price;
            var text3c = data[2].description;



            var moadlArea1 = $('<div id="innermodal1">');
            var moadlArea2 = $('<div id="innermodal2">');
            var moadlArea3 = $('<div id="innermodal3">');

            var modalContent = $(".modal-body");

            moadlArea1.append(text1)
                .append(text1a)
                .append(text1b)
                .append(text1c)

            moadlArea2.append(text2)
                .append(text2a)
                .append(text2b)
                .append(text2c)

            moadlArea3.append(text3)
                .append(text3a)
                .append(text3b)
                .append(text3c)

            modalContent.append(moadlArea1)
                .append(moadlArea2)
                .append(moadlArea3);

        })
    }
}
