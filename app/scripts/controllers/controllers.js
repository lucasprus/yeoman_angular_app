'use strict';
angular.module('usersApp.controllers', ['usersApp.services', 'ngRoute', 'ngCookies'])
/*  .controller('SelectedDateRangeController', ['$scope', 'DateRangeService', '$log',
    function ($scope, DateRangeService, $log) {
      $log.log('Called SelectedDateRangeController');
      $scope.DateRangeService = DateRangeService;
      $scope.period = function () {
        var periodToString = {
          day: 'aui.overview.period.day',
          week: 'aui.overview.period.week',
          month: 'aui.overview.period.month'
        };
        return periodToString[$scope.DateRangeService.period];
      };
    }
  ])
  .controller('DialogController', ['$scope', 'DateRangeService', '$log', '$window',
    function ($scope, DateRangeService, $log, $window) {
      $log.log('Called DialogController');
      $window.dialogControllerScope = $scope;
      $scope.DateRangeService = DateRangeService;

      var minMax = function () {
        var dateMax = new Date();
        dateMax.setDate(dateMax.getDate() - 1);
        var dateMin = new Date(dateMax.valueOf() - 400 * 1000 * 60 * 60 * 24); // 400 days ago
        return {
          min: dateMin,
          max: dateMax
        };
      };

      $scope.dialogDate = {
        end: DateRangeService.end,
        period: DateRangeService.period,
        min: minMax()
          .min,
        max: minMax()
          .max
      };

      $scope.updateDateRangeService = function () {
        $log.log('updateDateRangeService');
        DateRangeService.end = $scope.dialogDate.end;
        DateRangeService.period = $scope.dialogDate.period;
      };

      $scope.resetDialogDateRange = function () {
        $log.log('resetDialogDateRange');
        $scope.dialogDate.end = DateRangeService.end;
        $scope.dialogDate.period = DateRangeService.period;
      };
    }
  ])*/
/*  .controller('SomeController', ['$scope', '$log', '$window', '$rootScope',
    function ($scope, $log, $window, $rootScope) {
      $log.log('Called SomeController');
      $window.someControllerScope = $scope;
      $scope.i = 5;
    }
  ])
  .controller('CustomerController', ['$scope',
    function ($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }
  ])*/
.controller('UserListController', ['$scope', '$log', '$window', '$rootScope', 'UsersDataService', '$routeParams', '$cookieStore', 'AlertMessagesService',
  function ($scope, $log, $window, $rootScope, UsersDataService, $routeParams, $cookieStore, AlertMessagesService) {
    $log.log('Called UserListController');
    $window.userListControllerScope = $scope;

    var message;

    $scope.currentPage = parseInt($routeParams.pageNo, 10) || 1;
    $scope.view = $cookieStore.get('view') || 'default';

    $scope.$watch('view', function (newValue) {
      // console.log(newValue);
      $cookieStore.put('view', newValue);
    });

    UsersDataService.readList($scope.currentPage).then(function (data) {
        message = 'Successfully fetched users';
        $log.log(message);
        $scope.data = data.data;
        $scope.users = data.data.users;
        AlertMessagesService.push({
          type: 'success',
          message: message
        }, {
          type: 'info',
          message: "Total: " + $scope.data.count + " users"
        });
      },
      function () {
        message = 'Error fetching users';
        $log.log(message);
        AlertMessagesService.push({
          type: 'danger',
          message: message
        });
      });

  }
])
  .controller('PaginationController', ['$scope', '$log', '$window',
    function ($scope, $log, $window) {
      $log.log('Called PaginationController');
      $window.paginationControllerScope = $scope;

      var pagesTotal = function () {
        var data = $scope.data;
        return data && Math.ceil(data.count / data.maxUsersPerPage) || 0;
      };

      $scope.pages = function () {
        return new Array(pagesTotal());
      };

      $scope.isLastPage = function () {
        return pagesTotal() === $scope.currentPage;
      };

      $scope.isFirstPage = $scope.currentPage - 1 === 0;

      $scope.previousPageHref = !$scope.isFirstPage && ('#/users/list/page/' + ($scope.currentPage - 1)) || '';

    }
  ])
  .controller('UsersController', ['$scope', '$log', '$window',
    function ($scope, $log, $window) {
      $log.log('Called UsersController');
      $window.usersControllerScope = $scope;
    }
  ])
  .controller('UserController', ['$scope', '$log', '$window', '$rootScope', 'UsersDataService', '$routeParams', '$filter', '$location', 'AlertMessagesService',
    function ($scope, $log, $window, $rootScope, UsersDataService, $routeParams, $filter, $location, AlertMessagesService) {
      $log.log('Called UserController');
      $window.userControllerScope = $scope;

      var message;

      $scope.templates = {
        'user': 'views/templates/user.html',
        'user_edit': 'views/templates/user_edit.html'
      };

      $scope.data = {};
      // $scope.data.template = $scope.templates['user'];

      $scope.fetch = function () {
        UsersDataService.read($routeParams.userName, function (user) {
            message = 'Successfully fetched user';
            $log.log(message);
            $scope.user = user;
            $scope.user.birthday = $filter('date')(user.birthday, 'yyyy-MM-dd');
            $scope.data.template = $scope.templates.user;
            AlertMessagesService.push({
              type: 'success',
              message: message
            });
          },
          function (data, status) {
            message = (status === 404) ? 'User not found' : 'Error fetching user';
            $log.log(message);
            AlertMessagesService.push({
              type: 'danger',
              message: message
            });
          });
      };
      $scope.fetch();

      $scope.save = function () {
        UsersDataService.update($routeParams.userName, $scope.user, function (user) {
            message = 'Successfully updated user';
            $log.log(message);
            $scope.user = user;
            $scope.user.birthday = $filter('date')(user.birthday, 'yyyy-MM-dd');
            $scope.data.template = $scope.templates.user;
            AlertMessagesService.push({
              type: 'success',
              message: message
            });
          },
          function (data, status) {
            var statusToMessage = {
              404: "User not found",
              406: "Validation error",
              409: "Username or email already exists"
            };

            message = statusToMessage[status] || 'Error updating user';
            if (status === 406) {
              message = message + ': ' + data.error;
            }
            $log.log(message);
            AlertMessagesService.push({
              type: 'danger',
              message: message
            });
          });
      };

      $scope.delete = function () {
        UsersDataService.delete($routeParams.userName, function () {
            message = 'Successfully deleted user';
            $log.log(message);
            AlertMessagesService.push({
              type: 'success',
              message: message
            });
            $location.path('/users/list');
          },
          function (data, status) {
            message = (status === 404) ? 'User not found' : 'Error deleting user';
            $log.log(message);
            AlertMessagesService.push({
              type: 'danger',
              message: message
            });
          });
      };

    }
  ])
  .controller('UsersMenuController', ['$scope', '$log', '$window', '$location',
    function ($scope, $log, $window, $location) {
      $log.log('Called UsersMenuController');
      $window.usersMenuControllerScope = $scope;

      $scope.menuItems = [{
        href: '/users/home',
        glyphicon: 'home',
        label: ' Home'
      }, {
        href: '/users/list',
        glyphicon: 'list',
        label: ' List Users'
      }, {
        href: '/users/new',
        glyphicon: 'plus',
        label: ' Add User'
      }];

      $scope.isActive = function (menuItem) {
        return ($location.path()).indexOf(menuItem.href) !== -1;
      };

    }
  ])
  .controller('UsersNewController', ['$scope', '$log', '$window', '$rootScope', 'UsersDataService', '$location', 'AlertMessagesService',
    function ($scope, $log, $window, $rootScope, UsersDataService, $location, AlertMessagesService) {
      $log.log('Called UsersNewController');
      $window.usersNewControllerScope = $scope;

      var message;

      $scope.isNew = true;
      $scope.user = {
        "clientUsername": "",
        "name": "",
        "email": "",
        "password": "",
        "birthday": "",
        "gender": "M",
        "bio": ""
      };

      $scope.save = function () {
        UsersDataService.create($scope.user, function (user) {
            message = 'Successfully added user';
            $log.log(message);
            AlertMessagesService.push({
              type: 'success',
              message: message
            });
            $location.path('/user/' + user.username);
          },
          function (data, status) {
            var statusToMessage = {
              406: "Validation error",
              409: "Username or email already exists"
            };

            message = statusToMessage[status] || 'Error adding user';
            if (status === 406) {
              message = message + ': ' + data.error;
            }
            $log.log(message);
            AlertMessagesService.push({
              type: 'danger',
              message: message
            });
          });
      };

      $scope.fetch = function () {
        $location.path('/users/list');
      };

    }
  ])
  .controller('AlertMessagesController', ['$scope', '$log', '$window', 'AlertMessagesService',
    function ($scope, $log, $window, AlertMessagesService) {
      $log.log('Called AlertMessagesController');
      $window.alertMessagesControllerScope = $scope;

      $scope.alerts = AlertMessagesService.alerts;
      $scope.dismiss = function (alert) {
        AlertMessagesService.delete(alert);
      };
    }
  ])
  .controller('UsersStatsController', ['$scope', 'DateRangeService', 'UsersStatsService', 'AlertMessagesService', '$log', '$window',
    function ($scope, DateRangeService, UsersStatsService, AlertMessagesService, $log, $window) {
      $log.log('Called UsersStatsController');
      $window.usersStatsControllerScope = $scope;

      var message;

      UsersStatsService.ageGroups(function (data) {
          message = 'Successfully fetched age groups stats';
          $log.log(message);
          $scope.ageGroupsData = data;
          AlertMessagesService.push({
            type: 'success',
            message: message
          });
        },
        function () {
          message = 'Error fetching age groups stats';
          $log.log(message);
          AlertMessagesService.push({
            type: 'danger',
            message: message
          });
        });

      UsersStatsService.activity(function (data) {
          message = 'Successfully fetched activity stats';
          $log.log(message);
          $scope.activityData = data;
          AlertMessagesService.push({
            type: 'success',
            message: message
          });
        },
        function () {
          message = 'Error fetching activity stats';
          $log.log(message);
          AlertMessagesService.push({
            type: 'danger',
            message: message
          });
        });


      UsersStatsService.genderByAgeGroups(function (data) {
          message = 'Successfully fetched gender by age groups stats';
          $log.log(message);
          $scope.genderByAgeGroupsData = data;
          AlertMessagesService.push({
            type: 'success',
            message: message
          });
        },
        function () {
          message = 'Error fetching gender by age groups stats';
          $log.log(message);
          AlertMessagesService.push({
            type: 'danger',
            message: message
          });
        });







      /*      function dataHandlerSales(summaryChartData) {
        $scope.summarySalesChartData = summaryChartData;
      }

      function dataHandlerSuggestions(summaryChartData) {
        $scope.summarySuggestionsChartData = summaryChartData;
      }

      $scope.DateRangeService = DateRangeService;

      $scope.$watchCollection('DateRangeService', function (newValue) {
        $log.log('DateRangeService change in SummaryController', newValue);
        SummaryChartDataService(newValue.end.valueOf(), newValue.period, dataHandlerSales, ErrorHandlerService.onError, 'sales');
        SummaryChartDataService(newValue.end.valueOf(), newValue.period, dataHandlerSuggestions, ErrorHandlerService.onError, 'suggestions');
      });

      $scope.$watchCollection('DateRangeService', function (newValue) {
        $log.log('DateRangeService change in SummaryController', newValue);
        SummaryDataService(newValue.end.valueOf(), newValue.period, function (data) {
          $scope.data = data;
        }, ErrorHandlerService.onError);
      });*/

    }
  ])
  .controller('PhoneListCtrl', ['$scope', '$http',
    function ($scope, $http) {
      $http.get('http://localhost:5000/api/users/').success(function (data) {
        $scope.phones = data;
        $scope.orderProp = 'name';
      });

      $scope.orderProp = 'age';
      $scope.changed = false;

      $scope.orderPropChangeHandler = function () {
        // console.log(newValue);
        $scope.changed = true;
        // $cookieStore.put('view', newValue);
      };

    }
  ]);
