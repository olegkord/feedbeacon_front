'use strict';

angular.module('FeedBeacon',[
  'ui.router',
])
  .controller('UsersController', UsersController)
  .controller('RestaurantsController', RestaurantsController)
  .controller('SignoutController', SignoutController)
  .factory('Socket', Socket)
  .factory('User', ['Socket', function(Socket) {
    //include private variables here!!!
    // Socket.on('reservation', (reservation) => {
    //   console.log('RECEIVED AT USER!');
    // })
    /// IMPORTANT!
    return {

      isLoggedIn: false,
      currentUser: {},
      userForLogin: {}
    };
  }])
  .factory('Restaurant',['Socket', '$rootScope', function(Socket, $rootScope) {
    //local variables here
    let self = this;
    Socket.on('reservation', (data) => {
      console.log('rootscope has it?');
    })

    //
    return {
      updateReservations: function() {
        if($rootScope.DATA){
          this.reservations.push($rootScope.DATA);
          $rootScope.DATA = null;
        }
      },
      reservations: [],
      isLoggedIn: false,
      currentRestoUser: {},
      restoUserForLogin: {},
    }
  }])
  .run(['$rootScope','$state','User', 'Restaurant', function($rootScope, $state, User, Restaurant) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {

      if(Object.keys(User.currentUser).length != 0) {
        let isAuthenticationRequired = toState.data
          && toState.data.requiresLogin
          && !User.isLoggedIn;

        if (isAuthenticationRequired) {
          event.preventDefault();
          $state.go('login');
        }
      }
      else if(Object.keys(Restaurant.currentRestoUser).length != 0) {
        let isAuthenticationRequired = toState.data
          && toState.data.requiresLogin
          && !Restaurant.isLoggedIn;

        if (isAuthenticationRequired) {
          event.preventDefault();
          $state.go('login_restaurant');
        }
      }
    })
  }]);

  UsersController.$inject = ['$rootScope','$state','$http','User', 'Socket'];
  RestaurantsController.$inject = ['$rootScope', '$state', '$http', 'Restaurant', 'Socket']
  SignoutController.$inject = ['$http', '$state', 'User','Restaurant'];
  Socket.$inject = ['$rootScope']
