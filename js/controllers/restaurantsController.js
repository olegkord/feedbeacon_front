'use strict';

console.log('restaurant controller loaded');

function RestaurantsController($rootScope, $state, $http, Restaurant, Socket) {

  let self = this;

  self.newRestaurant = {};
  self.logInRestaurant = {};
  self.reservations = {};

  self.getCurrent = function() {
    return Restaurant.currentRestoUser;
  }

  self.getCurrentTags = function() {
    return Restaurant.currentRestoUser.foodTypes;
  }

  self.removeTag = function($event, tag) {

    $event.preventDefault();
    $event.stopPropagation();

    $http({
      method: 'PUT',
      url: 'https://thawing-plains-5333.herokuapp.com/restaurant/' + Restaurant.currentRestoUser._id || 'http://localhost:3000/restaurant/' + Restaurant.currentRestoUser._id,
      data: {pullTag: tag},
      headers: {'Content-Type': 'application/json'}
    }).then( (restaurant) => {
      Restaurant.currentRestoUser.foodTypes = restaurant.data.foodTypes;
      console.log('restaurant updated');
    })
  }

  self.addTag = function(newTag) {
    Restaurant.currentRestoUser.foodTypes.push(newTag);
    $http({
      method: 'PUT',
      url: 'https://thawing-plains-5333.herokuapp.com/restaurant/' + Restaurant.currentRestoUser._id || 'http://localhost:3000/restaurant/' + Restaurant.currentRestoUser._id,
      data: {newTag: newTag},
      headers: {'Content-Type': 'application/json'}
    }).then( (restaurant) => {
      Restaurant.currentRestoUser.foodTypes = restaurant.data.foodTypes;
      console.log('restaurant updated!');
      self.newTag = "";
    });
  }

  self.signIn = function() {
    if (Object.keys(self.logInRestaurant)) {
      Restaurant.restoUserForLogin = self.logInRestaurant;
    }
    $http({
      method: 'POST',
      url: 'https://thawing-plains-5333.herokuapp.com/restaurant/login'||'http://localhost:3000/restaurant/login',
      data: Restaurant.restoUserForLogin,
      headers: {'Content-Type': 'application/json'}
    }).then( (data) => {
      Restaurant.isLoggedIn = true;
      Restaurant.currentRestoUser = data.data.restaurant;
      $http.defaults.headers.common.Authorization = data.data.token;
      $state.go('restaurant_show', {id: data.data.restaurant._id});
    })
  }

  self.signOut = function() {
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
      url: 'https://thawing-plains-5333.herokuapp.com/restaurant/new' || 'http://localhost:3000/restaurant/new',
      data: self.newRestaurant,
      headers: {'Content-Type': 'application/json'}
    }).then( (restaurant) => {
      $state.go('login_restaurant');
    })
  }
  ////socket listeners:

  Socket.on('user reservation', (reservation) => {
    console.log('RECEIVED AT RESTAURANT!');
    if (intersect(self.getCurrentTags, reservation)) {

    }

  })

  //helper function:
  function intersect(target, incoming) {
    return incoming.some( (v) => {
      return target.indexOf(v) >= 0;
    });
  }
}
