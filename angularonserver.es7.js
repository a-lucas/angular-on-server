import jsdom from './jsdom-with-xmlhttprequest';

const superDom = jsdom.jsdom;

import http from 'http';

const express  = require('express');

import fs from 'fs';

const delay = function(ms, func) {
  return setTimeout(func, ms);
};

const interval = function(ms, func) {
  return setInterval(func, ms);
};

const app = express();


app.use("/dist", express.static(__dirname + "/dist/client"));
app.use("/views", express.static(__dirname + "/src/views"));
app.use("/libs", express.static(__dirname + "/libs"));


const html = fs.readFileSync('index.es7.html', 'utf8');

app.get('/', function(req, res, next) {
  return res.end(html);
});

const products = fs.readFileSync('public/products.html');

app.get('//products.html', function(req, res, next) {
  return res.end(products);
});

const getProducts = (req, res) => {

  const options = {
    host: 'fake-response.appspot.com',
    port: 80,
    path: '/?sleep=5'
  };

  http.get(options, (response) => {
    console.log("Got response: " + response.statusCode);
    return res.end(JSON.stringify([{
      name: 'test',
      price: 1
    },
      {
        name: 'test2',
        price: 2,
      }]))
  }).on('error', (e) => {
    console.log("Got error: " + e.message);
    return res.send(JSON.stringify([]));
  });

};

app.get('//products', (req, res, next) => {
  return getProducts(req, res);
});

app.get('/products', (req, res, next) => {
  return getProducts(req, res);
});

app.get("*", (req, res, next) => {
  var e, scope;
  var url = req.url;
  let document = superDom(html);
  console.log(document);

  let window = document.createWindow({
    localPrefix: 'http://localhost:3002' + url
  });
  e = window.document.getElementById('mainctl');

  if (window.angular != null) {

    console.log('Angular is defined');

    scope = window.angular.element(e).scope();
    scope.$apply(() => {
      scope.setLocation(req.url);
      return void 0;
    });

    return delay(50, function() {
      console.log(window.document.innerHTML);
      return res.end(window.document.innerHTML);
    });
  } else {
    console.log('window.angular is not defined', window.document.innerHTML);
    //console.log(window.document.innerHTML);
    return res.end(window.document.innerHTML);

  }
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception:');
  console.log(err);
  return console.log(err.stack);
});

app.listen(3002);

console.log('Listening on port 3002');

let document = superDom(html);

let window = document.createWindow({
  localPrefix: 'http://localhost:3002/'
});
