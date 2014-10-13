"use strict";
angular.module("usersApp.services", [])
  .constant('API_ENDPOINT', 'http://localhost:5000/api/users/')
// .constant('API_ENDPOINT', 'http://lp-users-api.herokuapp.com/api/users/')
.factory("UsersDataService", ["$http", "$log", "API_ENDPOINT",
  function ($http, $log, API_ENDPOINT) {
    $log.log("Called UsersDataService");

    return {
      readList: function (page) {
        return $http.get(API_ENDPOINT + '?page=' + page);
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
        activity: function (onSuccess, onError) {
          $http.get(API_ENDPOINT + 'stats/activity')
            .success(function (data, status) {

              var transform = function (json) {
                var data = json.data,
                  startDate = parseInt(json.meta.startDate, 10),
                  key, millisecondsPerDay = 864e5,
                  activityData = [],
                  l;

                function mappingFunction(value, index) {
                  return {
                    date: new Date(startDate + index * millisecondsPerDay),
                    value: value
                  };
                }

                for (key in data) {
                  if (data.hasOwnProperty(key)) {
                    l = data[key].length;
                    activityData.push({
                      name: key,
                      values: data[key].map(mappingFunction)
                    });
                  }
                }

                return {
                  meta: Object.keys(data),
                  data: activityData
                };

              };

              onSuccess(transform(data), status);

            })
            .error(onError);
        },
        genderByAgeGroups: function (onSuccess, onError) {
          $http.get(API_ENDPOINT + 'stats/gender-by-age-groups')
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
        push: function () {
          var alert, i = 0,
            l = arguments.length;

          function timeoutFunction(that, alert) {
            return function () {
              that.delete(alert);
            };
          }
          for (; i < l; i += 1) {
            alert = arguments[i];
            this.alerts.push(alert);
            var that = this;
            $timeout(timeoutFunction(that, alert), 3000);
          }
        },
        delete: function (alert) {
          var alerts = this.alerts;
          alerts.splice(alerts.indexOf(alert), 1);
        }
      };
    }
  ])
  .value('version', '0.1')
  .factory('SampleGenerator', function () {
    return {
      exponential: function (mean, size) {
        var i = 0,
          sample = [];
        for (; i < size; i = i + 1) {
          sample.push(-1 / (1 / mean) * Math.log(Math.random()));
        }
        return sample;
      },
      uniform: function (lower, upper, size) {
        var i = 0,
          sample = [];
        for (; i < size; i = i + 1) {
          sample.push(lower + Math.random() * (upper - lower));
        }
        return sample;
      },
      normal: function (size) {
        var i = 0,
          sample = [],
          theta, radius;
        for (; i < size; i = i + 1) {
          theta = 2 * Math.PI * Math.random();
          radius = Math.sqrt(-2 * Math.log(Math.random()));
          sample.push(radius * Math.cos(theta));
        }
        return sample;
      }
    };
  });
