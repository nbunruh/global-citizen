var APP = (function (app) {
  //initializeView
  console.log(app);
  app.initializeView();

  $('#location-form').on('submit', function(e) {
    e.preventDefault();
    return false;
  });

  $('#place-list').on('click', '.place-title', function () {
    app.showDetails($(this).data('id'));
  });

  $('#place-select').on('change', function() {
    console.log($(this).val());
    app.placeAndEvents.performSearch($(this).val());
  });

  return app;
}(APP || {}));
