'use strict';

/* jasmine specs for filters go here */

describe('filters', function () {
  beforeEach(module('usersApp.filters'));

  describe('interpolate', function () {
    beforeEach(module(function ($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function (interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });

  describe('dottedLimitTo', function () {

    it('should trim with dots strings longer than limit', inject(function (dottedLimitToFilter) {
      expect(dottedLimitToFilter('qwertyuiopa', 10)).toEqual('qwertyu...');
      expect(dottedLimitToFilter('qwertyuiopaaaaa', 10)).toEqual('qwertyu...');
      expect(dottedLimitToFilter('qwertyuiopa xxx yyy', 10)).toEqual('qwertyu...');
    }));

    it('should not trim strings not longer than limit', inject(function (dottedLimitToFilter) {
      expect(dottedLimitToFilter('qwertyuiop', 10)).toEqual('qwertyuiop');
      expect(dottedLimitToFilter('qwe', 10)).toEqual('qwe');
      expect(dottedLimitToFilter('', 10)).toEqual('');
    }));

    it('should return empty string for falsy values', inject(function (dottedLimitToFilter) {
      expect(dottedLimitToFilter(undefined, 10)).toEqual('');
      expect(dottedLimitToFilter(0, 10)).toEqual('');
      expect(dottedLimitToFilter('', 10)).toEqual('');
      expect(dottedLimitToFilter(false, 10)).toEqual('');
      expect(dottedLimitToFilter(null, 10)).toEqual('');
      expect(dottedLimitToFilter(NaN, 10)).toEqual('');
    }));

  });

});
