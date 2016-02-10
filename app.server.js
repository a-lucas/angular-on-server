'use strict';

var _jsdomWithXmlhttprequest = require('./jsdom-with-xmlhttprequest');

var _jsdomWithXmlhttprequest2 = _interopRequireDefault(_jsdomWithXmlhttprequest);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superDom = _jsdomWithXmlhttprequest2.default.jsdom;

var express = require('express');

var delay = function delay(ms, func) {
  return setTimeout(func, ms);
};

var interval = function interval(ms, func) {
  return setInterval(func, ms);
};

var app = express();

app.use("/dist", express.static(__dirname + "/dist/client"));
app.use("/views", express.static(__dirname + "/src/views"));
app.use("/libs", express.static(__dirname + "/libs"));

var html = _fs2.default.readFileSync('index.es7.html', 'utf8');

app.get('/', function (req, res, next) {
  return res.end(html);
});

var products = _fs2.default.readFileSync('public/products.html');

app.get('//products.html', function (req, res, next) {
  return res.end(products);
});

var getProducts = function getProducts(req, res) {

  var options = {
    host: 'fake-response.appspot.com',
    port: 80,
    path: '/?sleep=5'
  };

  _http2.default.get(options, function (response) {
    console.log("Got response: " + response.statusCode);
    return res.end(JSON.stringify([{
      name: 'test',
      price: 1
    }, {
      name: 'test2',
      price: 2
    }]));
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
    return res.send(JSON.stringify([]));
  });
};

app.get('//products', function (req, res, next) {
  return getProducts(req, res);
});

app.get('/products', function (req, res, next) {
  return getProducts(req, res);
});

app.get("*", function (req, res, next) {
  var e, scope;
  var url = req.url;
  var document = superDom(html);
  console.log(document);

  var window = document.createWindow({
    localPrefix: 'http://localhost:3002' + url
  });
  e = window.document.getElementById('mainctl');

  if (window.angular != null) {

    console.log('Angular is defined');

    scope = window.angular.element(e).scope();
    scope.$apply(function () {
      scope.setLocation(req.url);
      return void 0;
    });

    return delay(50, function () {
      console.log(window.document.innerHTML);
      return res.end(window.document.innerHTML);
    });
  } else {
    console.log('window.angular is not defined', window.document.innerHTML);
    //console.log(window.document.innerHTML);
    return res.end(window.document.innerHTML);
  }
});

process.on('uncaughtException', function (err) {
  console.log('Uncaught exception:');
  console.log(err);
  return console.log(err.stack);
});

app.listen(3002);

console.log('Listening on port 3002');

var document = superDom(html);

var window = document.createWindow({
  localPrefix: 'http://localhost:3002/'
});