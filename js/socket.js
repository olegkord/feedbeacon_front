'use strict';

console.log('Including socket factory');



function Socket($rootScope) {
let socket = io.connect('https://thawing-plains-5333.herokuapp.com/'||'http://localhost:3000');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, () => {
        let args = arguments;
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
