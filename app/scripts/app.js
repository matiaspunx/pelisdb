/* jshint ignore:start */
(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.firebaseURL = 'https://pelisdb.firebaseio.com';
  app.firebaseProvider = 'anonymous';
  
  app.movies = [];
  app.itemid = '';
  
  app.cleanFields = function() {
    this.newMovieImg = '';
    this.newMovieTitle = '';
    this.newMovieSinopsis = '';
    this.newMovieCast = '';
  };

  app.addMovie = function(event) {
    event.preventDefault(); // Don't send the form!
    this.ref.push({
      img: app.newMovieImg, 
      title: app.newMovieTitle,
      sinopsis: app.newMovieSinopsis,
      cast: app.newMovieCast
    });
    this.openedAdd = false;
    app.$.toast.text = '¡Pelicula ' + app.newMovieTitle + ' agregada con exito!';
    app.$.toast.show();
    app.cleanFields();
  };

  app.openEditMovie = function(event) {
    this.openedEdit = true;
    app.itemid = event.model.item.uid;
    this.newMovieImg = event.model.item.img;
    this.newMovieTitle = event.model.item.title;
    this.newMovieSinopsis = event.model.item.sinopsis;
    this.newMovieCast = event.model.item.cast;
  };

  app.openAddMovie = function(event) {
    this.openedAdd = true;
    app.cleanFields();
  };

  app.deleteMovie = function(event) {
    this.ref.child(event.model.item.uid).remove();
  };

  app.updateMovie = function(event) {
    event.preventDefault();
    console.log(app.itemid);
    this.ref.child(app.itemid).update({
      img: app.newMovieImg, 
      title: app.newMovieTitle,
      sinopsis: app.newMovieSinopsis,
      cast: app.newMovieCast
    });
    this.openedEdit = false;
    app.$.toast.text = '¡Pelicula ' + app.newMovieTitle + ' modificada con exito!';
    app.$.toast.show();
    app.cleanFields();
  };

  app.updateMovies = function(snapshot) {
    this.movies = [];
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.uid = childSnapshot.key();
      this.push('movies', item);
    }.bind(this));
  };

  app.onFirebaseError = function(event) {
    this.$.errorToast.text = event.detail.message;
    this.$.errorToast.show();
  };

  app.onFirebaseLogin = function(event) {
    this.ref = new Firebase(this.firebaseURL + '/user/' + event.detail.user.uid);
    this.ref.on('value', function(snapshot) {
      app.updateMovies(snapshot);
    });
  };

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Movie data base is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

})(document);
/* jshint ignore:end */
