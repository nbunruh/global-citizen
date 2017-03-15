var APP = (function (app) {




  return app;
}(APP || {}));

var eventManager = new EventManager();



    $(document).ready(function(){

        $("#openModal").on("click",function () {
            eventManager.evenApiCaller();
        })

    })
