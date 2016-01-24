'use strict';

function SignoutController($http, $state, User, Restaurant) {
  let self = this;

  self.globalSignOut = function() {
    $http.defaults.headers.common.Authorization = '';
    if (Object.keys(User.currentUser).length != 0) {
      User.currentUser = {};
      User.isLoggedIn = false;
    }
    else if (Object.keys(Restaurant.currentRestoUser).length != 0) {
      Restaurant.currentRestoUser = {};
      Restaurant.isLoggedIn = false;
    }
    else{
      console.log('chirp');
    }
    $state.go('home');
  }
}
