/**
 * Created by Hyungwu Pae on 3/16/17.
 */
var APP = (function (app) {
  var database = app.database;
  var usersRef = database.ref('users');

  //add to favorite places
  function toggleFavoritePlace(starElement) {
    var placeId = $(starElement).data('place-id');
    var placeName = $(starElement).data('place-name');
    if(app.user) {
      if($(starElement).hasClass('glyphicon-star-empty')) {
        //view update
        app.replaceClass(starElement, 'glyphicon-star-empty', 'glyphicon-star');
        //save this place_id to firebase
        console.log(placeName)
        usersRef.child(app.user.uid + "/favorite_places/" + placeId).set(placeName);

      } else { //remove from favorite places
        //view update
        app.replaceClass(starElement, 'glyphicon-star', 'glyphicon-star-empty');
        usersRef.child(app.user.uid + "/favorite_places/" + placeId).remove();
      }
    } else {
      app.showLoginModal();
    }

  }


  app.toggleFavoritePlace = toggleFavoritePlace;

  return app;


}(APP || {}));


