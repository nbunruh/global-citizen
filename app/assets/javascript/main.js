var APP = (function (app) {

  //initializeView
  app.initializeView();


  /**
   * Event Listen
   */

  //event listening for change of type of place
  $('#place-select').on('change', function() {
    app.placeAndEvents.performSearch($(this).val());
  });

  //event listening for change of category of event
  $('#event-select').on('change', function() {
    console.log($(this).val());
    app.evenApiCaller(undefined, $(this).val());
  });

  //place list click event listen
  $('#place-list').on('click', '.place-title', function () {
    app.showDetailsModal($(this).parents('li').data('place-id'), $(this).data('place-name'));
  });
  $('#place-list').on('click', '.media-object', function () {
    app.showDetailsModal($(this).parents('li').data('place-id'), $(this).data('place-name'));
  });

  //sign in click
  $('#sign-in').on('click', function () {
    app.showLoginModal();
  });

  //sign out click
  $('#sign-out').on('click', function () {
    app.signout();
  });

  //favorite icon (star) click => add favorite place to my favorite places list
  $('#detailsModal').on('click', '.favorite', function () {
    app.toggleFavoritePlace(this);
  });

  //click user name on the navbar => show profile modal
  $('#user-name').on('click', function () {
    app.showUserProfileModal();
  });

  //click place name inside user profile modal
  $('#favorite-places').on('click', '.place-title', function () {
    app.renderExpandedPlaceDetails($(this).data('place-id'));
  });

  return app;
}(APP || {}));
