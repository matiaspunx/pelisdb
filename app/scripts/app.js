(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  var profilePic = '';
  var profileName = '';

  app.firebaseURL = 'https://pelisdb.firebaseio.com';
  app.firebaseProvider = 'google';
  
  app.movies = [];
  app.itemid = '';

  // Sets app default base URL
  app.baseUrl = '/';
  
  // función para limpiar los campos del formulario de edit y add
  app.cleanFields = function() {
    this.newMovieImg = '';
    this.newMovieTitle = '';
    this.newMovieSinopsis = '';
    this.newMovieCast = '';
  };

  // funcion para abrir el dialog para editar pelicula
  app.openEditMovie = function(event) {
    this.openedEdit = true;
    app.itemid = event.model.item.uid;
    this.newMovieImg = event.model.item.img;
    this.newMovieTitle = event.model.item.title;
    this.newMovieSinopsis = event.model.item.sinopsis;
    this.newMovieCast = event.model.item.cast;
  };

  // funcion para abrir el dialog para agregar pelicula
  app.openAddMovie = function() {
    this.openedAdd = true;
    app.cleanFields();
  };

  // función para agregar una pelicula a la base de datos.
  app.addMovie = function(event) {
    event.preventDefault(); // prevent default para no enviar el formulario.
    if (app.newMovieTitle != '') {
      this.ref.push({
        title: app.newMovieTitle,
        img: app.newMovieImg, 
        sinopsis: app.newMovieSinopsis,
        cast: app.newMovieCast
      });
      this.openedAdd = false;
      app.$.toast.text = '¡Pelicula ' + app.newMovieTitle + ' agregada con exito!';
      app.$.toast.show();
      app.cleanFields();
    }
  };

  // borrar pelicula de la base de datos.
  app.deleteMovie = function(event) {
    this.ref.child(event.model.item.uid).remove();
  };

  // Actualizamos una pelicula.
  app.updateMovie = function(event) {
    event.preventDefault(); // prevent default para no enviar el formulario.
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
    profilePic = event.detail.user.google.profileImageURL;
    profileName = event.detail.user.google.displayName;
    this.ref = new Firebase(this.firebaseURL + '/user/' + event.detail.user.uid);
    this.ref.on('value', function(snapshot) {
      app.updateMovies(snapshot);
    });
  };

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
