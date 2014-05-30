'use strict';
angular.module('usersApp.filters', [])
  .filter('percentage', ['$filter',
    function ($filter) {
      return function (number, noParenthesis) {
        var value = $filter('number')(number);
        if (!noParenthesis) {
          return value && '(' + value + '%)';
        }
        return value && value + '%';
      };
    }
  ]);
