var APP = (function (app) {
<<<<<<< HEAD
=======
  //initializeView
  console.log(app);
  app.initializeView();
>>>>>>> master

  $('#location-form').on('submit', function(e) {
    e.preventDefault();
    return false;
  });

  $('#place-list').on('click', '.place-title', function () {
<<<<<<< HEAD
    console.log("asd;qwokdpoqwkd");
    app.showDetails($(this).data('id'));
  });

=======
    app.showDetails($(this).data('id'));
  });

  $('#place-select').on('change', function() {
    console.log($(this).val());
    app.placeAndEvents.performSearch($(this).val());
  });
>>>>>>> master

  return app;
}(APP || {}));
