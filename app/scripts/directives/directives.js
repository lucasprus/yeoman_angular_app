'use strict';
angular.module('usersApp.directives', [])
  .directive('dialog', function () {
    return {
      transclude: true,
      scope: {
        okLabel: '@',
        cancelLabel: '@',
        onOk: '&',
        onCancel: '&',
        visible: '='
      },
      restrict: 'E',
      templateUrl: 'views/partials/dialog.html',
      replace: true
    };
  })
  .directive('stripedTable', function () {
    return {
      scope: {
        caption: '@',
        postfix: '@',
        onRowClicked: '&',
        data: '=',
        selectedIndex: '='
      },
      controller: ['$scope', '$window',
        function ($scope, $window) {
          $window.stripedTableScope = $scope;

          $scope.updateSelectedIndex = function (index) {
            $scope.selectedIndex = index;
          };

          $scope.rowWidth = function (index) {
            return (index ? 75 / ($scope.data.meta.length - 1) : 25) + '%';
          };
        }
      ],
      templateUrl: 'views/partials/striped_table.html',
      replace: true
    };
  })
  .directive('mainMenu', function () {
    return {
      scope: {
        menuItems: '='
      },
      controller: ['$scope', '$location', '$window',
        function ($scope, $location, $window) {
          $window.mainMenuScope = $scope;
          $scope.active = $location.path();
        }
      ],
      restrict: 'E',
      templateUrl: 'views/partials/main_menu.html',
      replace: true
    };
  })
  .directive('myTabs', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: ['$scope',
        function ($scope) {
          // console.log('$scope: ', $scope);
          var panes = $scope.panes = [];

          $scope.select = function (pane) {
            angular.forEach(panes, function (pane) {
              pane.selected = false;
            });
            pane.selected = true;
          };

          this.addPane = function (pane) {
            if (panes.length === 0) {
              $scope.select(pane);
            }
            panes.push(pane);
          };
        }
      ],
      templateUrl: 'views/partials/my-tabs.html'
    };
  })
  .directive('myPane', function () {
    return {
      require: '^myTabs',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs, tabsCtrl) {
        scope.xxx = "zzz";
        // console.log('scope: ', scope);
        // console.log('element: ', element);
        tabsCtrl.addPane(scope);
      },
      templateUrl: 'views/partials/my-pane.html'
    };
  })
  .directive('myCustomer', function () {
    return {
      templateUrl: 'views/partials/my-customer.html',
      compile: function (tElement, tAttrs, transclude) {
        console.log('compile');
        console.log('tElement: ', tElement);

        // var node = tElement.get(0);
        // var clonedNode = node.cloneNode(true);
        // node.parentNode.appendChild(clonedNode);

        // var clonedNode = tElement.clone(true);
        // angular.element(tElement.get(0).parentNode).append(clonedNode);

        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {
            console.log('preLink');
            console.log('scope: ', scope);
            console.log('iElement: ', iElement);
          },
          post: function postLink(scope, iElement, iAttrs, controller) {
            console.log('postLink');
            console.log('scope: ', scope);
            console.log('iElement: ', iElement);
          }
        };
      }
    };
  })
  .directive('datepicker', function () {
    return function (scope, element) {
      $(element).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:c',
        dateFormat: 'yy-mm-dd'
      });
    };
  });
