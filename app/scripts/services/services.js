"use strict";
angular.module("usersApp.services", [])
  .constant('API_ENDPOINT', 'http://localhost:5000/api/users/')
// .constant('API_ENDPOINT', 'http://lp-users-api.herokuapp.com/api/users/')
.factory("UsersDataService", ["$http", "$log", "API_ENDPOINT",
  function ($http, $log, API_ENDPOINT) {
    $log.log("Called UsersDataService");

    return {
      readList: function (page, onSuccess, onError) {
        $http.get(API_ENDPOINT + '?page=' + page)
          .success(onSuccess)
          .error(onError);
      },
      create: function (user, onSuccess, onError) {
        $http.post(API_ENDPOINT, user)
          .success(onSuccess)
          .error(onError);
      },
      read: function (userName, onSuccess, onError) {
        $http.get(API_ENDPOINT + userName)
          .success(onSuccess)
          .error(onError);
      },
      update: function (userName, user, onSuccess, onError) {
        $http.put(API_ENDPOINT + userName, user)
          .success(onSuccess)
          .error(onError);
      },
      delete: function (userName, onSuccess, onError) {
        $http.delete(API_ENDPOINT + userName)
          .success(onSuccess)
          .error(onError);
      }
    };

  }
])
  .factory("UsersStatsService", ["$http", "$log", "API_ENDPOINT",
    function ($http, $log, API_ENDPOINT) {
      $log.log("Called UsersStatsService");

      return {
        ageGroups: function (onSuccess, onError) {
          $http.get(API_ENDPOINT + 'stats/age-groups')
            .success(onSuccess)
            .error(onError);
        },
        seriesChartData: function (onSuccess, onError) {
          $http.get(API_ENDPOINT + 'stats/series-chart-data')
            .success(function (data, status) {

              var transform = function (json) {
                var data = json.line,
                  key, millisecondsPerDay = 864e5,
                  summaryData = [],
                  l;

                for (key in data) {
                  l = data[key].length;
                  summaryData.push({
                    name: key,
                    values: data[key].map(function (value, index) {
                      return {
                        date: new Date((new Date()).valueOf() - (l - index - 1) * millisecondsPerDay),
                        value: value
                      };
                    })
                  });
                }
                return {
                  meta: Object.keys(data),
                  data: summaryData
                };
              };

              onSuccess(transform(data), status);

            })
            .error(onError);
        },
        barChartData: function (onSuccess, onError) {
          $http.get(API_ENDPOINT + 'stats/bar-chart-data')
            .success(onSuccess)
            .error(onError);
        }
      };

    }
  ])
  .factory("DateRangeService", ["$log",
    function ($log) {
      $log.log("Called DateRangeService");
      var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var end = new Date(Math.floor((new Date()
        .valueOf() - millisecondsPerDay) / millisecondsPerDay) * millisecondsPerDay);

      return {
        end: end,
        period: "month",
        start: function () {
          var dateStart = new Date(this.end);
          if (this.period === "month") {
            dateStart.setMonth(this.end.getMonth() - 1);
            dateStart.setDate(dateStart.getDate() + 1);
          } else if (this.period === "week") {
            dateStart.setDate(this.end.getDate() - 6);
          }
          return dateStart;
        }
      };
    }
  ])
  .factory("AlertMessagesService", ["$log", "$timeout",
    function ($log, $timeout) {
      $log.log("Called AlertMessagesService");
      return {
        alerts: [],
        push: function (alert) {
          this.alerts.push(alert);
          var that = this;
          $timeout(function () {
            that.delete(alert);
          }, 3000);
        },
        delete: function (alert) {
          var alerts = this.alerts;
          alerts.splice(alerts.indexOf(alert), 1);
        }
      };
    }
  ]);
