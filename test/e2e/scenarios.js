'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function () {

  // browser.get('index.html');

  // it('should automatically redirect to /view1 when location hash/fragment is empty', function () {
  //   expect(browser.getLocationAbsUrl())
  //     .toMatch('/');
  // });

  describe('view1', function () {
    console.log("start describe");

    beforeEach(function () {
      console.log("zzz");
      browser.get('#/');


    });

    it('should render view1 when user navigates to /view1', function () {
      console.log("start it 1");
      element(by.css('#test_div_to_hide')).click();


      waits(5000);

      runs(function () {
        console.log("runssss");

        // element(by.css('#test_div_to_hide')).click();

        element(by.css('#test_div_to_hide')).getCssValue('display').then(function (s) {
          expect(s).toBe("block");
        });

      });

      /*      runs(function(){

        console.log("runssss");

        element(by.css('#test_div_to_hide')).getCssValue('display').then(function(s){
          expect(s).toBe("none");
        });

      });*/



      /*      expect(element.all(by.css('[ng-view] h3'))
        .first()
        .getText())
        .
      toMatch(/yeoman_stats_api_and_angular_app/);
      console.log("end it 1");*/
    });



    /*    it('should render view1 when user navigates to /view1', function () {
      console.log("start it 2");
      expect(element.all(by.css('[ng-view] h3'))
        .first()
        .getText())
        .
      toMatch(/yeoman_stats_api_and_angular_app/);
      console.log("end it 2");
    });  */

    console.log("end describe");
  });



});
