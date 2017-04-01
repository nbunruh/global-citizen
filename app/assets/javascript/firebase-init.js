var APP = (function (app) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBC7ydaUnQbZfYzBZvMJ945RMFZt3fCDeo",
    authDomain: "global-citizens.firebaseapp.com",
    databaseURL: "https://global-citizens.firebaseio.com",
    projectId: "global-citizens",
    storageBucket: "global-citizens.appspot.com",
    messagingSenderId: "227446035170"
  };
  firebase.initializeApp(config);
  app.database = firebase.database();

  return app;


}(APP || {}));


