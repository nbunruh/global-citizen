var APP = (function (app) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAxRSX5Q7qHZi-tBSUhOtl_zn5S757QLUw",
    authDomain: "global-citizen.firebaseapp.com",
    databaseURL: "https://global-citizen.firebaseio.com",
    projectId: "global-citizen",
    storageBucket: "global-citizen.appspot.com",
    messagingSenderId: "367570053327"
  };
  firebase.initializeApp(config);
  app.database = firebase.database();

  return app;


}(APP || {}));


