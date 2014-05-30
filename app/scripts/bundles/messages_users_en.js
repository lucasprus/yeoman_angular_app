'use strict';
angular.module('usersApp.messages', [], ['$provide',
  function ($provide) {
    $provide.value('usersAppMessages', {
      'testLabel': 'Test value'
    });
  }
]);
