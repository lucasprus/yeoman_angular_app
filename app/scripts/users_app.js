'use strict';

angular.module('usersApp', ['ngAnimate', 'usersApp.controllers', 'usersApp.directives', 'usersApp.services', 'usersApp.filters', 'usersApp.messages', 'd3', 'd3BarsDirective', 'd3SeriesDirective', 'd3PieDirective'])
/*.config(['$httpProvider',
    function ($httpProvider) {
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.defaults.useXDomain = true;
    }
  ])*/
.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/users/list/page/:pageNo', {
        templateUrl: 'views/users.html',
        controller: 'UsersController'
      })
      .when('/users/list', {
        redirectTo: '/users/list/page/1'
      })
      .when('/users', {
        redirectTo: '/users/home'
      })
      .when('/users/new', {
        templateUrl: 'views/users_new.html',
        controller: 'UsersNewController'
      })
      .when('/users/home', {
        templateUrl: 'views/users_home.html',
        controller: 'UsersStatsController'
      })
      .when('/user/:userName', {
        templateUrl: 'views/user.html',
        controller: 'UserController'
      })
      .when('/', {
        redirectTo: '/users'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
  }
])
  .run(['$rootScope', 'usersAppMessages',
    function ($rootScope, usersAppMessages) {
      $rootScope.label = usersAppMessages;
    }
  ]);
