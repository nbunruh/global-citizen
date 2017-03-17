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
    app.showDetails($(this).data('place-id'), $(this).data('place-name'));
  });

  $('#place-select').on('change', function() {
    app.placeAndEvents.performSearch($(this).val());
  });

  $('#sign-out').on('click', function () {
    app.signout();
  });

  $('#detailsModal').on('click', '.favorite', function () {
    app.toggleFavoritePlace(this);
  });

  $('#user-name').on('click', function () {
    app.showUserProfileModal();
  });

  return app;
}(APP || {}));
