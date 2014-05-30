dialogControllerScope.$eval('DateRangeService.end | currency')
dialogControllerScope.$eval('DateRangeService.end | date:"short"')

dialogControllerScope.DateRangeService.end;

dialogControllerScope.$parent === dialogControllerScope.$root;

var root = dialogControllerScope.$root;


root.clickHandler = function() {
    alert('clickHandler');
}

root.timestamp = 1000*60*60*24;
dialogControllerScope.timestamp;
dialogControllerScope.$eval('timestamp | date:"fullDate"') 

dialogControllerScope.DateRangeService.end = new Date();

dialogControllerScope.clickHandler();

dialogControllerScope.$apply()

dialogControllerScope.$digest()


var el = $('<span>{{xxx}}</span>').get(0);
document.body.appendChild(el);

var $injector = angular.injector(['ng']);

var scope, link;

$injector.invoke(['$rootScope', '$compile', function($rootScope, $compile){
  scope = $rootScope.$new();
  link = $compile(el);
}]);

angular.element(el).scope()

scope.xxx = "Hell";
link(scope);

angular.element(el).scope().xxx

scope.$apply();

dialogControllerScope.$parent === dialogControllerScope.$root

var scope = dialogControllerScope.$new();
scope.timestamp;

scope.timestamp = 431114;

scope.$watch('timestamp ', function(newNames, oldNames) {
            console.log('timestamp changed');
          });
scope.$digest();


dialogControllerScope.$digest();



dialogControllerScope.xxx = "xx";

scope.$watch('xxx', function(newNames, oldNames) {
            console.log('xxx changed');
          });


scope.$watch('yyy', function(newNames, oldNames) {
            console.log('yyy changed');
          });

scope.$digest();
dialogControllerScope.$digest();

scope.xxx === dialogControllerScope.xxx;


scope.yyy = "£";

dialogControllerScope.hasOwnProperty('xxx');
scope.hasOwnProperty('xxx');
scope.hasOwnProperty('yyy ');

scope.__proto__ === dialogControllerScope;


var el = $('<span>{{xxx}}</span>').get(0);
$0.appendChild(el);

var scope = angular.element($0).scope();

scope.xxx= "sss";

scope.$apply();

angular.element($0).injector().invoke(function($compile) {
  $compile(el)(scope);
});



var el = $('<span ng-click="clickHandler()">click me</span>').get(0);



document.body.appendChild(el);


angular.element(el).injector().invoke(function($compile, $rootScope) {
  $compile(el)($rootScope);
});

angular.element($0).scope().$apply();

angular.element($0).scope().$digest();


root.clickHandler = function() {
alert('clickHandler');
}


var $div = $('<div ng-controller="MyCtrl">{{content.label}}</div>');
$(document.body).append($div);

angular.element($div).scope()

angular.element($0).injector().invoke(function($compile) {
  $compile(el)(scope);
});


angular.element($0).injector().get('DateRangeService')


angular.element($0).injector().has('$window')

angular.element($0).injector().get('DateRangeService')

var $injector = angular.injector(['ng']);

$injector.has('DateRangeService')
$injector.has('$window')

var $injector = angular.element($0).injector();

$injector.annotate($injector.get('DateRangeService'));


var filter = angular.element($0).injector().get('$controller')

var filter = angular.element($0).injector().get('$filter')

filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z')


var filter = angular.element($0).injector().get('$filter')

var RecommendationBlocksDataService = angular.element($0).injector().get('RecommendationBlocksDataService')

RecommendationBlocksDataService(new Date(), 'day', function (tableData) {
console.log(tableData);
} , function () {
console.log('Error');
});


angular.element($0).injector().has('DateRangeService')

var explicit = function(DateRangeService) {
console.log(DateRangeService.period);
console.log(DateRangeService.end);
};

explicit.$inject = ['DateRangeService'];
var injector = angular.element($0).injector();

injector.invoke(explicit);


injector.invoke(['DateRangeService', function(DateRangeService) {
console.log(DateRangeService.period);
console.log(DateRangeService.end);
}]);

var Foo = function(DateRangeService) {
this.foo = DateRangeService.end;
this.bar = DateRangeService.period;
this.fool = function() {
return this.foo + " " + this.bar;
};
};

Foo.$inject = ['DateRangeService'];

injector.instantiate(Foo).fool();


injector.instantiate(['DateRangeService', function(DateRangeService) {
this.foo = DateRangeService.end;
this.bar = DateRangeService.period;
this.fool = function() {
return this.foo + " " + this.bar;
};
}]);


injector.annotate(Foo);

var scope = angular.element(document.body).scope();

var injector = angular.injector(['ng', 'statsApp']);

injector.invoke(['$controller', function($controller) {
console.log($controller('MainMenuController', {'$scope': scope}));

}]);

scope.menuItems

angular.element($0).injector().invoke(['$rootScope', function($rootScope) {
console.log($rootScope === scope);
}]);

var childScope = scope.$new()

childScope.menuItems


childScope.$watch('showOverlay', function(newValue, oldValue) {
             console.log('xx')
           });

childScope.$digest();

 childScope.name = 'miskow';
           childScope.counter = 0;
           childScope.$watch('name', function(newValue, oldValue) {
             childScope.counter = childScope.counter + 1;
           });
childScope.$digest();





var exp;

angular.element($0).injector().invoke(['$rootScope', '$interpolate', function($rootScope, $interpolate){
  exp = $interpolate('Hello {{name.first | uppercase}} {{name.last | lowercase}}!');
}]);

exp({name: {first: 'LuCaS', last: 'PrUs'}});


var exp;

var injector = angular.injector(['ng']);

injector.invoke(['$interpolate', function($interpolate){
exp = $interpolate.startSymbol() + $interpolate.endSymbol()
}]);



var customInterpolationApp = angular.module('customInterpolationApp', []);
 
customInterpolationApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('//').endSymbol('//');
});

var injector = angular.injector(['ng', 'customInterpolationApp']);

var exp;

injector.invoke(['$rootScope', '$interpolate', function($rootScope, $interpolate){
  exp = $interpolate('Hello //name.first | uppercase// //name.last | lowercase//!');
}]);

exp({name: {first: 'LuCaS', last: 'PrUs'}});





var el = $('<div><button ng-click="count = count + 1">Increment</button><span>count: {{count}}</span></div>').get(0);
document.body.appendChild(el);

angular.element(el).scope().$root.count = 5

angular.element(el).injector().invoke(function($compile, $rootScope) {
  $compile(el)($rootScope);
});


angular.element(el).scope().$apply();




// Users

var $injector = angular.injector(['ng']);

$injector.invoke(['$http', function($http){

$http.get('http://localhost:3000/api/users').
    success(function(data, status) {
      console.log('Success!');
      // $scope.status = status;
      // $scope.data = data;
    }).
    error(function(data, status) {
      console.log('Error!');
      // $scope.data = data || "Request failed";
      // $scope.status = status;
  });

}]);
