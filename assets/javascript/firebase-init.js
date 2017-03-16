var APP = (function (app) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAumyYYmzpHea4zyErWSwq613w4nXp8rJ8",
    authDomain: "global-citizen.firebaseapp.com",
    databaseURL: "https://global-citizen.firebaseio.com",
    storageBucket: "global-citizen.appspot.com",
    messagingSenderId: "367570053327"
  };
  firebase.initializeApp(config);
  app.database = firebase.database();

  return app;


}(APP || {}));


