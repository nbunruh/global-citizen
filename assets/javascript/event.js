var APP = (function (app) {

  $('#location-form').on('submit', function(e) {
    e.preventDefault();
    return false;
  });

  $('#place-list').on('click', '.place-title', function () {
    console.log("asd;qwokdpoqwkd");
    app.showDetails($(this).data('id'));
  });


  return app;
}(APP || {}));
