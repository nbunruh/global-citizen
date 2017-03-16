var APP = (function (app) {

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

  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);


  function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        if(app.user && user.uid === app.user.uid) return; // token refresh (user already logged in state)
        else {
          signin(user);
        }
      }
      else signout();
    });
  }

  function signin(user) {
    // User is signed in.
    console.log(user);
    app.user = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      accessToken: user.accessToken,
      emailVerified: user.emailVerified,
      uid: user.uid
    };

    //update view: user logged in
    app.renderUserUI(app.user);
  }

  function signout() {
    firebase.auth().signOut()
      .then(function () {
        app.user = null;
        app.renderGuestUI();
      })
  }


  app.signout = signout;

  initApp();

  return app;


}(APP || {}));


