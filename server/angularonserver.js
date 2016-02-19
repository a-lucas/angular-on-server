var md = require('cli-md');
var fs = require('fs');
var yargs = require('yargs');
var jsdom = require("jsdom");
var utils = require('./utils');
var util = require('util');
var vm = require('vm');
var StackTrace = require('stacktrace-js');
var appConfig = require('./config');

serverConfig = appConfig.serverConfig;
clientConfig = appConfig.clientConfig;

console.log('ServerConfig loaded: ', serverConfig);






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
          //src: '',
          src: ExpressHelper.getClientJS(),
          features: {
            FetchExternalResources :  false,
            ProcessExternalResources:  false
          },
          url: 'http://localhost:3002' + url,
          virtualConsole: jsdom.createVirtualConsole().sendTo(console),
          created: function (err, window) {

            if (err) {
              console.error('ERR CATCHED IN CREATED', err);
              return;
            }

            window.scrollTo = function () {};
            window.onServer = true;
            window.fs = fs;
            window.logFiles = serverConfig.logFiles;
            window.clientConfig = clientConfig;
            window.addEventListener('error', function(err) {
              console.log('EVENT LISTENER ON ERROR CATCHED', err);
            });


            window.InjectServer = InjectServer.InjectServer;
          },
          done: function (err, window) {
            if (err) {
              //@todo manually write inside serverConfig.logFiles.error.path
              console.error('ERR CATCHED IN DONE', err);
              utils.closeSession(null, window);
              return;
            }

            c_window.window = Object.assign(c_window.window, window);
            var angularApp = c_window.angular.bootstrap(c_window.document, ["myApp"]);
            var $log = angularApp.invoke( function($log) {
              return $log;
            });;

            var rendering = false;

            var serverTimeout = setTimeout(function() {
              if (rendering) return;
              $log.error('SERVER TIMEOUT ! ! !');
              //@todo Get the error URl here
              rendering = true;
              const html = utils.getHTML(c_window, [ serverTimeout ]);
              utils.closeSession(c_window, window);
              res.end ( html );
            }, serverConfig.timeout);

            console.log(typeof c_window.addEventListener);
            c_window.window.addEventListener('ServerExceptionHandler', function(e) {
              rendering = true;
              StackTrace.get()
                  .then(function(stack){
                    console.log('StackTrace.get', stack);
                  })
                  .catch(function(err){
                    console.log('StackTrace.catch', err);
                  });
              $log.error("ServerExceptionHandler caught on server");
              $log.error(e);
              utils.closeSession(c_window, window);
              res.end('SERVER-ERROR');
            });

            c_window.window.addEventListener('StackQueueEmpty', function () {
              if (rendering) return;
              rendering = true;
              const html = utils.getHTML(c_window, [ serverTimeout ]);
              utils.closeSession(c_window, window);
              res.end ( html );
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

      app.listen(serverConfig.port);

      console.log('App listening on ', serverConfig.port, ' Access client on http://localhost:' + serverConfig.port);
    })
    .command('client', md(MDDoc.client), function() {
      app.get("*", function(req, res, next) {
        return res.end( ExpressHelper.getClientHtml() );
      });
      app.listen(3004);
      console.log('App listening on 3004, Access client on http://localhost:3004');
    })
    .demand(1)
    .help('help')
    .argv;


