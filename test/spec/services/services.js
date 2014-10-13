'use strict';

/* jasmine specs for services go here */

describe('service', function () {
  beforeEach(module('usersApp.services'));

  describe('version', function () {
    it('should return current version', inject(function (version) {
      expect(version).toEqual('0.1');
    }));
  });

  describe('SampleGenerator', function () {
    it('should return a sample of requested size', inject(function (SampleGenerator) {

      expect(SampleGenerator.exponential(5, 0).length).toEqual(0);
      expect(SampleGenerator.uniform(-20, -10, 0).length).toEqual(0);
      expect(SampleGenerator.normal(0).length).toEqual(0);

      expect(SampleGenerator.exponential(5, 20).length).toEqual(20);
      expect(SampleGenerator.uniform(-20, -10, 100).length).toEqual(100);
      expect(SampleGenerator.normal(5).length).toEqual(5);

    }));
  });

  describe('AlertMessagesService', function () {

    beforeEach(function () {
      jasmine.Clock.useMock();
    });

    it('should delete AlertMessagesService alerts after some time', inject(function (AlertMessagesService, $timeout) {

      // var timerCallback = jasmine.createSpy('timerCallback');
      // jasmine.Clock.useMock();

      /*var flag;

      AlertMessagesService.push({
        type: 'success',
        message: 'success message'
      }, {
        type: 'info',
        message: 'info message'
      });   

      expect(AlertMessagesService.alerts.length).toBe(2)

      setTimeout(function() {
        flag = true;
      }, 4000);


        waitsFor(function() {
          return flag;
        }, "The Value should be incremented", 15550);

        runs(function() {
          expect(AlertMessagesService.alerts.length).toBe(0);
        });*/



      // expect(timerCallback).not.toHaveBeenCalled();

      // jasmine.Clock.tick(101);

      // expect(timerCallback).toHaveBeenCalled();


      AlertMessagesService.push({
        type: 'success',
        message: 'success message'
      }, {
        type: 'info',
        message: 'info message'
      });

      expect(AlertMessagesService.alerts.length).toBe(2);
      $timeout.flush();
      expect(AlertMessagesService.alerts.length).toBe(0);

    }));
  });



});
