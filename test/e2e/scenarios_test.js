'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

/*describe('describe', function () {

  console.log('start describe');

  it('should be a test', function () {
    console.log("start it 2");
    runs(function () {
      console.log("it 2 runs 1");
      this.foo = 0
      this.foo++;
      var bar = 0;
      bar++;

      expect(this.foo)
        .toEqual(1);
      expect(bar)
        .toEqual(1);
    });
    runs(function () {
      console.log("it 2 runs 2");
      this.foo++;
      var bar = 0
      bar++;

      expect(this.foo)
        .toEqual(2);
      expect(bar)
        .toEqual(1);
    });

    console.log("end it 2");
  });

  console.log("end describe");

});*/

describe("describe", function () {
  console.log("start describe");
  var flag, value, intId;

  it("should simulate an asynchronous call", function () {

    console.log("start it 3");

    runs(function () {
      console.log("it 3 runs 1");
      flag = false,
      value = 0,
      intId = setInterval(function () {
        console.log(value);
        if (++value == 3) {
          flag = true;
          clearInterval(intId);
        }
      }, 10);
    });

    waitsFor(function () {
      // console.log("waitsFor");
      return flag;
    }, "The Value should be incremented", 50);

    runs(function () {
      console.log("flag: " + flag);
      console.log("value: " + value);
    });


    console.log("end it 3");

  });

  console.log("end describe");

});

describe("describe", function () {

  console.log("start describe");

  it("should simulate an asynchronous call", function () {
    console.log("start it 4");

    // waits(500);

    runs(function () {
      console.log("it 4 runs 1");
      expect(0)
        .toEqual(0);
    });

    // console.log("start2");

    console.log("end it 4");
  });



  it("should simulate an asynchronous call", function () {
    console.log("start it 5");
    var flag, value, intId;
    runs(function () {
      flag = false;
      value = 0;
      intId = setInterval(function () {
        console.log(value);
        if (value++ == 3) {
          clearInterval(intId);
          flag = true;
        }
      }, 500);
    });

    waitsFor(function () {
      return flag;
    }, "The Value should be incremented", 5000);

    runs(function () {
      expect(value).toEqual(4); //this will fail
    });
  });




  console.log("end describe");

});
