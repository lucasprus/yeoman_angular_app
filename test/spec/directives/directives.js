'use strict';

describe('directives', function () {
  beforeEach(module('usersApp.directives'));

  describe('app-version', function () {
    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should print current version', function () {
      inject(function ($compile) {
        element = $compile('<span app-version></span>')(scope);
        expect(element.text()).toEqual('0.1');
      });
    });
  });
});
