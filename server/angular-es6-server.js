import yargs from 'yargs';
import Contextify from 'contextify';
import fs from 'fs';
import jsdom from "jsdom";
//import preboot from 'preboot';
import {delay, getClientHtml, getFiles, getServerHtml, interval, log, logObject} from './utils';
import http from 'http';
import express from 'express';
import NgOverride from './utils/ngOverride';

const files = [  './dist/client/app.js'];
const rootPath = __dirname + '/..';
const products = fs.readFileSync('./src/views/products.html');
const todos = fs.readFileSync('./src/views/products.html');


const app = express();

app.use("/dist", express.static(rootPath + "/dist/client"));
app.use("/views", express.static(rootPath + "/src/views"));
//app.use("/libs", express.static(__dirname + "/libs"));

app.get('/', function(req, res, next) {
  var data = getClientHtml();
  console.log(data);
  return res.end(data);
});

/***
 * VIEWS
 */

app.get('//products.html', function(req, res, next) {
  return res.end(products);
});

app.get('//todos.html', function(req, res, next) {
  return res.end(todos);
});


// 96 412 408

/**
 * REST API
 */

getProducts = function(req, res) {

  var options = {
    host: 'fake-response.appspot.com',
    port: 80,
    path: '/?sleep=5'
  };

  http.get(options, function(response) {
    console.log("Got response: " + response.statusCode);
    return res.end(JSON.stringify([{
      name: 'test',
      price: 1
    },
      {
        name: 'test2',
        price: 2,
      }]))
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    return res.send(JSON.stringify([]));
  });

};

app.get('//products', function(req, res, next) {
  log('Getting //products');
  return getProducts(req, res);
});

app.get('/products', function(req, res, next) {
  log('Getting /products');
  return getProducts(req, res);
});

app.get('/favicon.ico', function(req, res, next) {
  log('Getting my empty favicon');
  return res.send('');
})

/**
 * HONE PAGE
 */
function angularServer(res, url) {
  c_window = Contextify({console : console});
  c_window.window = c_window.getGlobal();
  c_window.window.scrollTo = function() {};

  config = {
    file: 'index.es7.html',
    src: getFiles(files),
    features: {
      FetchExternalResources : false,
      ProcessExternalResources: false
    },
    url: 'http://localhost:3002' + url,
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    created: function (err, window) {
      window.scrollTo = function () {};
      window.onServer = true;
    },
    done: function (err, window) {
      var opts = {};  // see options section below
      c_window.window = Object.assign(c_window.window, window);
      c_window.angular.module('ngAnimate', []);

      //c_window.angular = NgOverride(c_window.angular);

      c_window.angular.bootstrap(c_window.document, ["myApp", serverApp]);

      e = c_window.window.document.getElementById('mainDiv');
      scope = c_window.window.angular.element(c_window.document).scope();



      setTimeout(function () {

        var html = '<html id="myApp">'
            + c_window.window.document.children[0].innerHTML
            + '</html>';

        console.log(html);

        res.end (html);

      }, 1000);

    },
    document: {
      referer: '',
      cookie: 'key=value; expires=Wed, Sep 21 2011 12:00:00 GMT; path=/',
      cookieDomain: '127.0.0.1'

    }
  };


  jsdom.debugMode = true;
  jsdom.env(config);

}


yargs.usage('$0  [args]')
    .command('server', 'Generate the server side HtML, and serves it to http://localhost:3002', function (yargs, argv) {

      app.get("*", function(req, res, next) {
        var url = req.url;

        angularServer(res, url);
      });

      app.listen(3002);
    })
    .command('client', 'Generate a classic app at http://localhost:3004', function() {
      app.get("*", function(req, res, next) {
        return res.end( getClientHtml());
      });
      app.listen(3004);
    })
    .demand(1)
    .help('help')
    .argv;


