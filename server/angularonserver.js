var md = require('cli-md');
var fs = require('fs');
var yargs = require('yargs');
var jsdom = require("jsdom");
var utils = require('./utils');

var util = require('util');
var vm = require('vm');

//var preboot = require('preboot');

var path = require('path');

var MDDoc = {};
MDDoc.server = fs.readFileSync( path.resolve(  './doc/cli.server.md')).toString();
MDDoc.client = fs.readFileSync( path.resolve(  './doc/cli.client.md')).toString();

var ExpressHelper = require('./express/express');

var app = ExpressHelper.appServer();
ExpressHelper.restApiMiddleWare(app);

yargs.usage('$0  [args]')
    .command('server', md(MDDoc.server) , function (yargs, argv) {

      app.get("*", function(req, res, next) {


        var url = req.url;

        c_window = utils.getContext();

        config = {
          file: 'index.es7.html',
          src: ExpressHelper.getClientJS(),
          features: {
            FetchExternalResources : false,
            ProcessExternalResources: false
          },
          url: 'http://localhost:3002' + url,
          virtualConsole: jsdom.createVirtualConsole().sendTo(console),
          created: function (err, window) {
            window.scrollTo = function () {};
            window.onServer = true;
            window.fs = fs;
            window.logFiles = {
              log: path.resolve( './debug.log'),
              error: path.resolve( './error.log')
            }
          },
          done: function (err, window) {
            var opts = {};  // see options section below


            c_window.window = Object.assign(c_window.window, window);
            c_window.angular.bootstrap(c_window.document, ["myApp"]);

            var e = c_window.window.document.getElementById('mainDiv');
            var scope = c_window.window.angular.element(c_window.document).scope();
            var rendering = false;


            var getHTML = function() {
              scope.$apply();
              rendering = true;
              var html = '<html id="myApp">'
                  + c_window.window.document.children[0].innerHTML
                  + '</html>';
              clearTimeout(serverTimeout);
              window.close();
              c_window.dispose();
              console.log(html);
              return html;
            };

            var serverTimeout = setTimeout(function() {
              if (rendering) return;
              console.log('SERVER TIMEOUT ! ! !');
              res.end ( getHTML() );
            }, 10000);


            c_window.window.addEventListener('StackQueueEmpty', function () {
              if (rendering) return;
              res.end ( getHTML() );
            }, false);

          },
          document: {
            referer: '',
            cookie: 'key=value; expires=Wed, Sep 21 2011 12:00:00 GMT; path=/',
            cookieDomain: '127.0.0.1'

          }
        };


        jsdom.debugMode = true;
        jsdom.env(config);



      });



      app.listen(3002);
    })
    .command('client', md(MDDoc.client), function() {
      app.get("*", function(req, res, next) {
        return res.end( getClientHtml());
      });
      app.listen(3004);
    })
    .demand(1)
    .help('help')
    .argv;


