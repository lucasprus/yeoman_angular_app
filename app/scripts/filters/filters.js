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
  ])
  .filter('interpolate', ['version',
    function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }
  ])
  .filter('dottedLimitTo', function () {
    return function (text, limit) {
      if (!text) {
        return '';
      }
      if (text.length <= limit) {
        return text;
      } else {
        return text.substr(0, limit - 3) + '...';
      }
    };
  });
