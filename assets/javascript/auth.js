var APP = (function (app) {

  var database = app.database;

  // FirebaseUI config.
  var uiConfig = {
    callbacks: {
      // Called when the user has been successfully signed in.
      signInSuccess: function(user, credential) {
        signin(user);
        return false; //no redirect
      }
    },
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'https://global-citizen.firebaseapp.com'
  };


  function initFirebaseAuth() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
    firebase.auth().onAuthStateChanged(function(user) {

      if(user) {
        if(app.user && user.uid === app.user.uid) return; // token refresh (user already logged in state)
        else {
          return signin(user);
        }
      }
      else return signout();
    });
  }

  function signin(user) {
    // User is signed in.
    app.user = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL || 'assets/images/userDefault.png',
      accessToken: user.accessToken,
      emailVerified: user.emailVerified,
      uid: user.uid
    };

    //update view: user logged in
    app.renderUserUI(app.user);

    //If this user is a new user, save user uid and name
    database.ref('users/' + app.user.uid).once('value')
      .then(function (userSnap) {
        if(!userSnap.exists()) {
          database.ref('users/' + app.user.uid).set({
            name: app.user.name,
            email: user.email
          })
        }
      })

  }

  function signout() {
    firebase.auth().signOut()
      .then(function () {
        app.user = null;
        app.renderGuestUI();
      })
  }


  app.signout = signout;

  initFirebaseAuth();

  return app;


}(APP || {}));


