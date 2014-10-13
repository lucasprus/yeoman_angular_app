'use strict';

describe('Controllers: ', function () {
  var readListResponse = function () {
    return {
      "users": [{
        "__v": 0,
        "_id": "51d14f6c8e1b3f6844000004",
        "bio": "tortor. Integer",
        "birthday": "1927-01-19T00:00:00.000Z",
        "email": "sit.amet@ligulaaenean.org",
        "gender": "F",
        "name": "Elizabeth Buck",
        "password": "COS06HBY9Pw",
        "username": "elizabethbuck",
        "meta": {
          "created_at": "2013-07-01T09:44:12.464Z",
          "updated_at": "2014-05-02T15:09:26.741Z"
        }
      }, {
        "__v": 0,
        "_id": "51d14f6c8e1b3f6844000032",
        "bio": "nisi a",
        "birthday": "1912-07-18T00:00:00.000Z",
        "email": "libero@magna.com",
        "gender": "F",
        "name": "12",
        "password": "DWL45IPQ8RF",
        "username": "eveavery",
        "meta": {
          "created_at": "2013-07-01T09:44:12.487Z",
          "updated_at": "2014-09-18T10:39:50.406Z"
        }
      }, {
        "__v": 0,
        "_id": "51d14f6c8e1b3f684400000f",
        "bio": "XXX",
        "birthday": "1978-08-27T23:00:00.000Z",
        "email": "ipsum.primis@mi.ca",
        "gender": "M",
        "name": "Fiona Floyd",
        "password": "ZND91SQC9FO",
        "username": "fionafloyd",
        "meta": {
          "created_at": "2013-07-01T09:44:12.468Z",
          "updated_at": "2013-07-01T09:44:12.468Z"
        }
      }, {
        "name": "Foo Bar",
        "email": "foo@bar.com",
        "password": "foobar",
        "birthday": "1987-09-01T00:00:00.000Z",
        "gender": "M",
        "bio": "",
        "username": "foobar",
        "_id": "5416fddf065e220200597366",
        "__v": 0,
        "meta": {
          "updated_at": "2014-09-15T14:55:27.879Z",
          "created_at": "2014-09-15T14:55:27.878Z"
        }
      }, {
        "username": "gailgarner",
        "name": "Gail Garner",
        "email": "magna@Nullainterdum.net",
        "password": "XSA53EYU8TE",
        "birthday": "1922-12-10T00:00:00.000Z",
        "gender": "F",
        "bio": "non, egestas a, dui.",
        "_id": "51d14f6c8e1b3f684400004b",
        "__v": 0,
        "meta": {
          "updated_at": "2013-07-01T09:44:12.505Z",
          "created_at": "2013-07-01T09:44:12.505Z"
        }
      }],
      "count": 71,
      "maxUsersPerPage": 5
    };
  };

  describe('UsersMenuController', function () {

    // load the controller's module
    beforeEach(module('usersApp.controllers'));

    var UsersMenuController,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      UsersMenuController = $controller('UsersMenuController', {
        $scope: scope
      });
    }));

    it('should attach a list of menuItems to the scope', function () {
      expect(scope.menuItems.length).toBe(3);
    });
  });

  describe('AlertMessagesController', function () {

    // load the controller's module
    beforeEach(module('usersApp.controllers'));

    var AlertMessagesController,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      AlertMessagesController = $controller('AlertMessagesController', {
        $scope: scope
      });
    }));

    it('should have alerts defined', function () {
      expect(scope.alerts).toBeDefined();
    });
  });

  describe('PhoneListCtrl', function () {
    var scope, ctrl, $httpBackend;

    // Load our app module definition before each test.
    beforeEach(module('usersApp.controllers'));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service in order to avoid a name conflict.
    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:5000/api/users/').
      respond([{
        name: 'Nexus S'
      }, {
        name: 'Motorola DROID'
      }]);

      scope = $rootScope.$new();


      ctrl = $controller('PhoneListCtrl', {
        $scope: scope
      });
    }));

    it('should create "phones" model with 2 phones fetched from xhr', function () {
      expect(scope.phones).toBeUndefined();
      $httpBackend.flush();

      expect(scope.phones).toEqual([{
        name: 'Nexus S'
      }, {
        name: 'Motorola DROID'
      }]);
    });

    it('should set the default value of orderProp model', function () {
      expect(scope.orderProp).toBe('age');
    });

    it('should set the default value of orderProp model', function () {
      expect(scope.changed).toBe(false);
      expect(scope.orderPropChangeHandler).not.toBeUndefined();
      spyOn(scope, 'orderPropChangeHandler').andCallThrough();
      scope.$watch('orderProp', scope.orderPropChangeHandler);
      expect(scope.orderProp).toBe('age');
      scope.orderProp = 'name';
      scope.$digest();
      scope.$apply();
      expect(scope.changed).toBe(true);
      // console.log('zzzzzzzzzzzzzzz', scope.orderPropChangeHandler)
      // expect(scope.orderPropChangeHandler).not.toBeUndefined();
      // scope.orderPropChangeHandler();
      // expect(scope.changed).toBe(true);
      expect(scope.orderPropChangeHandler).toHaveBeenCalled();
      // expect(scope.orderPropChangeHandler).toHaveBeenCalledWith('name', 'age');
    });

  });


  describe('UserListController', function () {

    var scope;

    beforeEach(module('usersApp.controllers'));

    describe('with default view pageNo set to 8 and successful readList response', function () {

      var $httpBackend, $cookieStore;

      beforeEach(inject(function (_$httpBackend_, _$cookieStore_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:5000/api/users/?page=8').respond(readListResponse());
        $cookieStore = _$cookieStore_;
        scope = $rootScope.$new();
        $controller('UserListController', {
          $scope: scope,
          $routeParams: {
            pageNo: 8
          }
        });
      }));


      it('should set currentPage on scope', function () {
        expect(scope.currentPage).toBe(8);
      });

      it('should set view on scope', function () {
        expect(scope.view).toBe('default');
      });

      it('should update $cookieStore when view changes', function () {
        scope.view = 'detailed';
        scope.$digest();
        expect($cookieStore.get('view')).toBe('detailed');
      });

      xit('should create "users" model with 5 users fetched from UsersDataService', function () {
        expect(scope.users).toBeUndefined();
        $httpBackend.flush();
        scope.$digest();
        // scope.$apply();
        expect(scope.data).toEqual(readListResponse().users);
        // expect(scope.users.length).toBe(5);
      });

      it('should add two alerts to AlertMessagesService', inject(function (AlertMessagesService) {
        expect(AlertMessagesService.alerts.length).toBe(0);
        $httpBackend.flush();
        expect(AlertMessagesService.alerts.length).toBe(2);
      }));

    });



    xdescribe('on', function () {

      var deferred, AlertMessagesService;

      beforeEach(inject(function ($rootScope, $controller, $q, _AlertMessagesService_) {
        deferred = $q.defer();
        AlertMessagesService = _AlertMessagesService_;
        var promise = deferred.promise;
        scope = $rootScope.$new();
        $controller('UserListController', {
          $scope: scope,
          UsersDataService: {
            readList: function () {
              return promise;
            }
          }
        });
      }));


      describe('successful readList response', function () {

        it('should create "users" model', function () {
          expect(scope.users).toBeUndefined();
          deferred.resolve(readListResponse());
          scope.$digest();
          expect(scope.users).toEqual(readListResponse().users);
        });

        it('should add one alert to AlertMessagesService', function () {
          expect(AlertMessagesService.alerts.length).toBe(0);
          deferred.resolve(readListResponse());
          scope.$digest();
          expect(AlertMessagesService.alerts.length).toBe(2);
        });

      });

      describe('unsuccessful readList response', function () {

        it('should not create "users" model', function () {
          expect(scope.users).toBeUndefined();
          deferred.reject();
          scope.$apply();
          expect(scope.users).toBeUndefined();
        });

        it('should add one alert to AlertMessagesService', function () {
          expect(AlertMessagesService.alerts.length).toBe(0);
          deferred.reject();
          scope.$apply();
          expect(AlertMessagesService.alerts.length).toBe(1);
        });

      });

    });




    describe('with detailed view', function () {
      var $cookieStore;

      beforeEach(inject(function ($httpBackend, $rootScope, $controller, _$cookieStore_) {
        $cookieStore = _$cookieStore_;
        $httpBackend.expectGET('http://localhost:5000/api/users/?page=1').
        respond(readListResponse());
        scope = $rootScope.$new();
        $cookieStore.put('view', 'detailed');
        $controller('UserListController', {
          $scope: scope,
        });
      }));

      it('should set view on scope', function () {
        expect(scope.view).toBe('detailed');
      });

      it('should update $cookieStore when view changes', function () {
        scope.view = 'default';
        scope.$digest();
        expect($cookieStore.get('view')).toBe('default');
      });

    });


  });

  describe('PaginationController', function () {

    var scope;

    beforeEach(module('usersApp.controllers'));

    describe('on page 1 with 71 results and 5 items per page', function () {

      beforeEach(inject(function ($rootScope, $controller) {
        var parentScope = $rootScope.$new();
        parentScope.data = readListResponse();
        parentScope.currentPage = 1;
        scope = parentScope.$new();

        $controller('PaginationController', {
          $scope: scope
        });
      }));

      it('should have 15 pages', function () {
        expect(scope.pages().length).toBe(15);
      });

      it('should not be on last page', function () {
        expect(scope.isLastPage()).toBe(false);
      });

      it('should be on first page', function () {
        expect(scope.isFirstPage).toBe(true);
      });

    });

    describe('on page 5 with 71 results and 5 items per page', function () {

      beforeEach(inject(function ($rootScope, $controller) {
        var parentScope = $rootScope.$new();
        parentScope.data = readListResponse();
        parentScope.currentPage = 5;
        scope = parentScope.$new();

        $controller('PaginationController', {
          $scope: scope
        });
      }));

      it('should have 15 pages', function () {
        expect(scope.pages().length).toBe(15);
      });

      it('should not be on last page', function () {
        expect(scope.isLastPage()).toBe(false);
      });

      it('should not be on first page', function () {
        expect(scope.isFirstPage).toBe(false);
      });

    });

    describe('on page 15 with 71 results and 5 items per page', function () {

      beforeEach(inject(function ($rootScope, $controller) {
        var parentScope = $rootScope.$new();
        parentScope.data = readListResponse();
        parentScope.currentPage = 15;
        scope = parentScope.$new();

        $controller('PaginationController', {
          $scope: scope
        });
      }));

      it('should have 15 pages', function () {
        expect(scope.pages().length).toBe(15);
      });

      it('should be on last page', function () {
        expect(scope.isLastPage()).toBe(true);
      });

      it('should not be on first page', function () {
        expect(scope.isFirstPage).toBe(false);
      });

    });


  });


  describe('AlertMessagesController', function () {

    var scope;

    beforeEach(module('usersApp.controllers'));

    beforeEach(inject(function ($rootScope, $controller, AlertMessagesService) {
      scope = $rootScope.$new();

      AlertMessagesService.push({
        type: 'success',
        message: 'success message'
      }, {
        type: 'info',
        message: 'info message'
      });

      $controller('AlertMessagesController', {
        $scope: scope
      });
    }));

    it('should have alerts set on scope', function () {
      expect(scope.alerts.length).toBe(2);
    });

    it('should delete dismissed alerts', function () {
      scope.dismiss(scope.alerts[0]);
      expect(scope.alerts.length).toBe(1);
      scope.dismiss(scope.alerts[0]);
      expect(scope.alerts.length).toBe(0);
    });

  });


  describe('UsersMenuController', function () {

    var scope;

    beforeEach(module('usersApp.controllers'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    describe('isActive', function () {

      it('should return correct values on Home page', inject(function ($controller, $location) {
        $location.path('/users/home');

        $controller('UsersMenuController', {
          $scope: scope
        });

        expect(scope.isActive(scope.menuItems[0])).toBe(true);
        expect(scope.isActive(scope.menuItems[1])).toBe(false);
        expect(scope.isActive(scope.menuItems[2])).toBe(false);
      }));

      it('should return correct values on List Users page', inject(function ($controller, $location) {
        $location.path('/users/list');

        $controller('UsersMenuController', {
          $scope: scope
        });

        expect(scope.isActive(scope.menuItems[0])).toBe(false);
        expect(scope.isActive(scope.menuItems[1])).toBe(true);
        expect(scope.isActive(scope.menuItems[2])).toBe(false);
      }));

      it('should return correct values on Add User page', inject(function ($controller, $location) {
        $location.path('/users/new');

        $controller('UsersMenuController', {
          $scope: scope
        });

        expect(scope.isActive(scope.menuItems[0])).toBe(false);
        expect(scope.isActive(scope.menuItems[1])).toBe(false);
        expect(scope.isActive(scope.menuItems[2])).toBe(true);
      }));

    });

  });

  describe('UserController', function () {

    var scope;

    beforeEach(module('usersApp.controllers'));

    describe('on successful read response', function () {

      var $httpBackend;

      beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:5000/api/users/jaquelynhoffman').respond({
          "username": "jaquelynhoffman",
          "name": "Jaquelyn Hoffman",
          "email": "ac.arcu@volutpatNulla.ca",
          "password": "CWW31PKA1KN",
          "birthday": "1976-01-15T00:00:00.000Z",
          "gender": "F",
          "bio": "fermentum metus. Aenean sed",
          "_id": "51d14f6c8e1b3f6844000010",
          "__v": 0,
          "meta": {
            "updated_at": "2013-07-01T09:44:12.469Z",
            "created_at": "2013-07-01T09:44:12.469Z"
          }
        });

        scope = $rootScope.$new();
        $controller('UserController', {
          $scope: scope,
          $routeParams: {
            userName: 'jaquelynhoffman'
          }
        });
      }));


      it('should create "user" model fetched from UsersDataService', function () {
        expect(scope.user).toBeUndefined();
        $httpBackend.flush();
        // scope.$digest();
        // scope.$apply();
        expect(scope.user).not.toBeUndefined();
        expect(scope.user.username).toBe('jaquelynhoffman');
        expect(scope.user._id).toBe('51d14f6c8e1b3f6844000010');
        expect(scope.user.birthday).toBe('1976-01-15');
      });

      it('should add successful alert to AlertMessagesService', inject(function (AlertMessagesService) {
        expect(AlertMessagesService.alerts.length).toBe(0);
        $httpBackend.flush();
        expect(AlertMessagesService.alerts.length).toBe(1);
        expect(AlertMessagesService.alerts[0].type).toBe('success');
        expect(AlertMessagesService.alerts[0].message).toBe('Successfully fetched user');
      }));

      it('should set user view template', function () {
        $httpBackend.flush();
        expect(scope.data.template).toBe('views/templates/user.html');
      });

    });

    describe('on 404 read response', function () {

      var $httpBackend;

      beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:5000/api/users/jaquelynhoffman').respond(404, {
          error: 'User not found'
        });

        scope = $rootScope.$new();
        $controller('UserController', {
          $scope: scope,
          $routeParams: {
            userName: 'jaquelynhoffman'
          }
        });
      }));

      it('should not create "user" model', function () {
        expect(scope.user).toBeUndefined();
        $httpBackend.flush();
        scope.$digest();
        expect(scope.user).toBeUndefined();
      });

      it('should add danger alert to AlertMessagesService', inject(function (AlertMessagesService) {
        expect(AlertMessagesService.alerts.length).toBe(0);
        $httpBackend.flush();
        expect(AlertMessagesService.alerts.length).toBe(1);
        expect(AlertMessagesService.alerts[0].type).toBe('danger');
        expect(AlertMessagesService.alerts[0].message).toBe('User not found');
      }));

    });

    describe('on 500 read response', function () {

      var $httpBackend;

      beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:5000/api/users/jaquelynhoffman').respond(500);

        scope = $rootScope.$new();
        $controller('UserController', {
          $scope: scope,
          $routeParams: {
            userName: 'jaquelynhoffman'
          }
        });
      }));

      it('should not create "user" model', function () {
        expect(scope.user).toBeUndefined();
        $httpBackend.flush();
        scope.$digest();
        expect(scope.user).toBeUndefined();
      });

      it('should add danger alert to AlertMessagesService', inject(function (AlertMessagesService) {
        expect(AlertMessagesService.alerts.length).toBe(0);
        $httpBackend.flush();
        expect(AlertMessagesService.alerts.length).toBe(1);
        expect(AlertMessagesService.alerts[0].type).toBe('danger');
        expect(AlertMessagesService.alerts[0].message).toBe('Error fetching user');
      }));

    });

    xdescribe('when updating user', function () {});

    describe('when deleting user', function () {

      var $httpBackend;

      beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:5000/api/users/jaquelynhoffman').respond({
          "username": "jaquelynhoffman",
          "name": "Jaquelyn Hoffman",
          "email": "ac.arcu@volutpatNulla.ca",
          "password": "CWW31PKA1KN",
          "birthday": "1976-01-15T00:00:00.000Z",
          "gender": "F",
          "bio": "fermentum metus. Aenean sed",
          "_id": "51d14f6c8e1b3f6844000010",
          "__v": 0,
          "meta": {
            "updated_at": "2013-07-01T09:44:12.469Z",
            "created_at": "2013-07-01T09:44:12.469Z"
          }
        });


        scope = $rootScope.$new();
        $controller('UserController', {
          $scope: scope,
          $routeParams: {
            userName: 'jaquelynhoffman'
          }
        });
        $httpBackend.flush();
      }));


      it('should add message to AlertMessagesService', inject(function (AlertMessagesService) {
        expect(scope.user).not.toBeUndefined();
        expect(AlertMessagesService.alerts.length).toBe(1);
        $httpBackend.expectDELETE('http://localhost:5000/api/users/jaquelynhoffman').respond();
        scope.delete();
        $httpBackend.flush();
        expect(AlertMessagesService.alerts.length).toBe(2);
        expect(AlertMessagesService.alerts[0].type).toBe('success');
        expect(AlertMessagesService.alerts[0].message).toBe('Successfully fetched user');
        expect(AlertMessagesService.alerts[1].type).toBe('success');
        expect(AlertMessagesService.alerts[1].message).toBe('Successfully deleted user');
      }));

      it('should change $location.path', inject(function ($location) {
        $location.path('/users/jaquelynhoffman');
        $httpBackend.expectDELETE('http://localhost:5000/api/users/jaquelynhoffman').respond();
        scope.delete();
        $httpBackend.flush();
        expect($location.path()).toBe('/users/list');
      }));

    });

  });


});

xdescribe("A spec (with setup and tear-down)", function () {
  var foo = 0;

  beforeEach(function () {
    foo += 1;
  });

  afterEach(function () {
    foo -= 1;
  });

  it("is just a function, so it can contain any code", function () {
    expect(foo).toEqual(1);
  });

  it("can have more than one expectation", function () {
    expect(foo).toEqual(1);
    expect(true).toEqual(true);
  });

  describe("nested", function () {

    it("is just a function, so it can contain any code", function () {
      expect(foo).toEqual(1);
    });

    it("can have more than one expectation", function () {
      expect(foo).toEqual(1);
      expect(true).toEqual(true);
    });
  });

});
