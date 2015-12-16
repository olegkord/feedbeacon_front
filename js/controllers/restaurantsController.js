'use strict';

console.log('restaurant controller loaded');

function RestaurantsController($rootScope, $state, $http, Restaurant, Socket) {

  let self = this;

  self.newRestaurant = {};
  self.logInRestaurant = {};

  self.signIn = function() {
    if (Object.keys(self.logInRestaurant)) {
      Restaurant.restoUserForLogin = self.logInRestaurant;
    }
    $http({
      method: 'POST',
      url: 'http://localhost:3000/restaurant/login',
      data: Restaurant.restoUserForLogin,
      headers: {'Content-Type': 'application/json'}
    }).then( (data) => {
      Restaurant.isLoggedIn = true;
      Restaurant.currentRestoUser = data.data.restaurant;
      $http.defaults.headers.common.Authorization = data.data.token;
      $state.go('restaurant_show', {id: data.data.restaurant._id});
    })
  }

  self.signOut = function(resto) {
    $http.defaults.headers.common.Authorization = '';
    Restaurant.isLoggedIn = false;
    Restaurant.currentRestoUser = {};
    Restaurant.restoUserForLogin = {};
    $state.go('home');
  }

  self.addRestoUser = function(user) {
    //These fields will depend on the required data inputs for restaurant.
    console.log('adding a restaurant user!');
    self.newRestaurant.foodTypes = self.newRestaurant.foodTypes.split(', ');
    $http({
      method: 'POST',
      url: 'http://localhost:3000/restaurant/new',
      data: self.newRestaurant,
      headers: {'Content-Type': 'application/json'}
    }).then( (restaurant) => {
      $state.go('login_restaurant');
    })
  }

}
