'use strict';

console.log('Including socket factory');



function Socket($rootScope) {
let socket = io.connect('http://localhost:3000');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, () => {
        $rootScope.socketData = arguments[0].data
        let args = arguments;
        $rootScope.$apply( function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, () => {
        let args = arguments;
        $rootScope.$apply( function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  }
}
