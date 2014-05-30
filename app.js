var express = require('express');
// var https = require('https');
var http = require('http');
var app = express();
// app.set('title', 'My App');
// app.set('author', 'Lucas Prus');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.enable('trust proxy');
/*app.locals({
  phone: '1-250-858-9990',
  email: 'me@myapp.com'
});*/

if ('development' === app.get('env')) {
  app.use('/dist', express.static(__dirname + '/dist'));

  /*  app.use(require('connect-livereload')({
    port: 35729
  }));*/
  app.use(express.static(__dirname + '/.tmp'));
  app.use(express.static(__dirname + '/app'));
} else if ('production' === app.get('env')) {
  app.use(express.static(__dirname + '/dist'));
}

// app.use(express.logger());
// app.use('/api', express.basicAuth('xxx', 'ttt'));
// app.all('/api/*', express.basicAuth('username', 'password'));
// app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/my_files' }));
/*app.get('/overview/view', function (req, res) {
    var body = 'Welcome to ' + app.get('title');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});*/

function randomValue() {
  return Math.random() * 1000 + 500;
}

function randomSample(n) {
  var i, arr = [];
  for (i = 0; i < n; i = i + 1) {
    arr.push(randomValue());
  }
  return arr;
}

function randomSection(max, sampleLength) {
  var i, arr = [];
  var numberOfSections = Math.ceil(Math.random() * max) + 1;
  for (i = 0; i < numberOfSections; i = i + 1) {
    arr.push({
      cells: ["Version " + (i + 1)].concat(randomSample(sampleLength))
    });
  }
  return arr;
}

function sleep(milliseconds) {
  var start = new Date()
    .valueOf();
  while ((new Date()
    .valueOf() - start) < milliseconds) {}
}

var periodToDays = {
  day: 1,
  week: 7,
  month: 30
};

app.get('/api/split_tests.json', function (req, res) {
  sleep(1000);

  var start = parseInt(req.query.start, 10);
  var period = req.query.period;
  var millisecondsPerDay = 86400000;

  var json = {
    "timestamp": new Date()
      .valueOf(),
    "range": {
      "start": start,
      "end": start + millisecondsPerDay * periodToDays[period]
    },
    "table": {
      "headers": ["logicBlock", "suggestionQueries", "suggestions", "queriesClicked", "influencedSales", "directSales"],
      "data": []
    }
  };

  var sectionNames = ["Home", "Search", "Product", "Category", "Cart", "Social", "Email"];

  for (var i = 0, l = sectionNames.length; i < l; i = i + 1) {
    json.table.data.push({
      "cells": [sectionNames[i]].concat(randomSample(5)),
      "splits": randomSection()
    });
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.json(json);

});
app.get('/api/logic_blocks.json', function (req, res) {
  sleep(1000);

  var start = parseInt(req.query.start, 10);
  var period = req.query.period;
  var millisecondsPerDay = 86400000;

  var json = {
    "timestamp": new Date()
      .valueOf(),
    "range": {
      "start": start,
      "end": start + millisecondsPerDay * periodToDays[period]
    },
    "table": {
      "headers": ["logicBlock", "suggestionQueries", "suggestions", "queriesClicked", "influencedSales", "directSales"],
      "data": []
    }
  };

  var sectionNames = ["Home", "Search", "Product", "Category", "Cart", "Social", "Email"];

  for (var i = 0, l = sectionNames.length; i < l; i = i + 1) {
    json.table.data.push({
      "cells": [sectionNames[i]].concat(randomSample(5))
    });
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.json(json);
});


app.get('/api/table_data.json', function (req, res) {
  sleep(1000);

  var end = parseInt(req.query.end, 10);
  var period = req.query.period;
  var millisecondsPerDay = 86400000;
  var rows = [];

  var json = {
    meta: {
      end: end,
    },
    data: {
      headers: ["logicBlock", "suggestionQueries", "suggestions", "queriesClicked", "influencedSales", "directSales"]
    }
  };

  var sectionNames = ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5", "Section 6", "Section 7"];

  for (var i = 0, l = sectionNames.length; i < l; i = i + 1) {
    rows.push({
      "cells": [sectionNames[i]].concat(randomSample(5))
    });
  }

  json.data.rows = rows;

  // res.header("Access-Control-Allow-Origin", "*");
  res.json(json);
});


app.get('/api/series_data.json', function (req, res) {
  sleep(1000);
  var end = parseInt(req.query.end, 10),
    period = req.query.period.toLowerCase(),
    millisecondsPerDay = 86400000,
    numberOfDays = periodToDays[period],
    meta = ["series1", "series2", "series3"],
    data = {},
    json = {
      meta: {
        end: end
      }
    },
    i, l;

  for (i = 0, l = meta.length; i < l; i = i + 1) {
    data[meta[i]] = randomSample(numberOfDays);
  }

  json.data = data;

  // res.header("Access-Control-Allow-Origin", "*");
  res.json(json);
});



app.get('/api/summary_data.json', function (req, res) {
  sleep(1000);
  var end = parseInt(req.query.end, 10),
    period = req.query.period.toLowerCase();

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Expose-Headers", "Content-Length,X-Powered-By,Content-Type");

  res.jsonp({
    section1: {
      stat1: randomValue(),
      stat2: randomValue(),
      stat3: randomValue()
    },
    section2: {
      stat1: randomValue(),
      stat2: randomValue(),
      stat3: randomValue()
    },
    section3: {
      stat1: randomValue(),
      stat2: randomValue(),
      stat3: randomValue()
    }
  });
});



/*
app.get('/jsonp', function (req, res) {
    res.jsonp({ user: 'tobi' });
});

app.post('/jsonp', function (req, res) {
    res.jsonp({ user: 'tobi' });
});*/
/*app.get('/hello', function (req, res) {
    var body = 'Welcome to ' + app.get('title');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});
*/
/*
app.get('/render', function (req, res) {
    app.render('email', {
        name: 'Tobi'
    }, function (err, html) {
    if (err) { throw err; }
        res.send(html);
    });
});

app.get('/api/users', function (req, res) {
    res.send(req.user);
});


app.get('/upload', function (req, res) {
    res.render('upload');
});

app.post('/upload', function (req, res) {
  console.log(req.files.file);
    res.send('Upload done.');
});*/

var port = process.env.PORT || 4000;
http.createServer(app)
  .listen(port);
// https.createServer(app).listen(3001);
// app.listen(4000);
console.log('Listening on port ' + port);
// console.log(app.settings);
/*console.log(app.get('env'));
console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_USER);
console.log(process.env.DATABASE_PASSWORD);
console.log(app.locals);*/
