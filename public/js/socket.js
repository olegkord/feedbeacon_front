'use strict';

console.log('Including socket factory');



function Socket($rootScope) {
let socket = io.connect('https://thawing-plains-5333.herokuapp.com');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, (data) => {
        let args = data;
        $rootScope.DATA = data;
        $rootScope.$apply( () => {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, () => {
        let args = arguments;
        $rootScope.$apply( () => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  }
}
