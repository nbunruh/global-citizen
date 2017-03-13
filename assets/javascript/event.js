var APP = (function (app) {


  $('#location-form').on('submit', function(e) {
    e.preventDefault();
    return false;
  });


  return app;
}(APP || {}));
