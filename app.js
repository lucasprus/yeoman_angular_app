'use strict';
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

/*app.get('/api/summary_data.json', function (req, res) {
  sleep(1000);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Expose-Headers", "Content-Length,X-Powered-By,Content-Type");

});*/



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
