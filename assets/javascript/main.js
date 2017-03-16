var APP = (function (app) {

  //initializeView
  console.log(app);
  app.initializeView();



  //Event Listen
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

  $('#sign-out').on('click', function () {
    app.signout();
  });

  $('#detailsModal').on('click', '.favorite', function () {
    app.toggleFavoritePlace(this);
  });

  return app;
}(APP || {}));
