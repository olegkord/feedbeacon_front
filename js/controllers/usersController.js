'use strict';

console.log('usercontroller loaded!');

function UsersController($rootScope, $state, $http, User, Socket) {

  let self = this;

  self.newUser = {};
  self.logInUser = {};

  //objects for user profile instance:
  self.likes = [];
  self.needs = [];

//class methods
  self.signIn = function() {
    console.log('logging in user!');
    if (Object.keys(self.logInUser)) {
      User.userForLogin = self.logInUser;
    }
    $http({
      method: 'POST',
      url: 'http://localhost:3000/user/login',
      data: User.userForLogin,
      headers: {'Content-Type': 'application/json'}
    }).then( (data) => {
      User.isLoggedIn = true;
      User.currentUser = data.data.user;
      $http.defaults.headers.common.Authorization = data.data.token;
      $state.go('user_show', {id: data.data.user._id});
    })
  }

  self.signOut = function(user) {
    console.log('logging out user!');
    $http.defaults.headers.common.Authorization = '';
    User.isLoggedIn = false;
    User.currentUser = {};
    User.userForLogin = {};
    $state.go('home');
  }

  self.addUser = function(user) {
    console.log('adding a user!');
    self.newUser.foodTypes = self.newUser.foodTypes.split(', ');
    $http({
      method: 'POST',
      url: 'http://localhost:3000/user/new',
      data: self.newUser,
      headers: {'Content-Type': 'application/json'}
    }).then( (user) => {
      $state.go('login');
    });
  }

  self.getCurrentUserLikes = function() {
    return User.currentUser.foodTypes;
  }

  self.newLike = function(like) {
    console.log('appending list of current user likes');
    User.currentUser.foodTypes.push(like);

    //update database user object with the new like
    $http({
      method: 'PUT',
      url: 'http://localhost:3000/user/' + User.currentUser._id,
      data: {newLike: like},
      headers: {'Content-Type': 'application/json'}
    }).then( (user) => {
      User.currentUser.foodTypes = user.data.foodTypes;
      console.log('user updated!');
    });
   }

   self.removeLike = function($event, food) {
     console.log('removing like');
     $event.preventDefault();
     $event.stopPropagation();

     $http({
       method: 'PUT',
       url: 'http://localhost:3000/user/' + User.currentUser._id,
       data: {pullFood: food},
       headers: {'Content-Type': 'application/json'}
     }).then( (user) => {
       User.currentUser.foodTypes = user.data.foodTypes;
       console.log('user updated');
     })
   }

   self.addNeed = function($event, food) {
     console.log('moving like to need');
      let index = User.currentUser.foodTypes.indexOf(food);
      self.needs.push(User.currentUser.foodTypes.splice(index,1));
   }

   self.removeNeed = function($event, food) {
     console.log('removing need');
     let index = User.currentUser.foodTypes.indexOf(food);
     self.needs.splice(index,1);
   }


    self.updateUser = function() {
      console.log('updating user');
    }

    self.deleteUser = function() {
      console.log('deleting a user');
    }

    self.sendRequest = function(needs) {
      Socket.emit('user request', {needs: needs})
    }
  }
