/**
 * Created by antoine on 16/02/16.
 */
var express = require('express');
var fs = require('fs');
var path = require('path');
var helmet = require('helmet');
var http = require('http');

var rootPath = __dirname + '/../../';

exports.getClientHtml = function() {
    return fs.readFileSync('index.es7.html', 'utf8');
};


exports.getServerHtml = function() {
    return fs.readFileSync('index.server.html', 'utf8');
};

exports.test = function() {
      var p = path.resolve( rootPath + '/dist/angular/server.js' );
    var data = fs.readFileSync(p , 'utf8');
    return eval( data);
};
exports.getClientJS = function() {

    var files = [
        path.resolve( rootPath + '/node_modules/angular/angular.js' ),
        path.resolve( rootPath + '/node_modules/angular-resource/angular-resource.js' ),
        path.resolve( rootPath + '/node_modules/angular-route/angular-route.js' ),
        path.resolve( rootPath + '/dist/angular/server.js' ),
        path.resolve( rootPath + '/dist/client/app.js' ),
    ];

    var fileSrc = [];

    for(var i in files) {
        fileSrc[i] = fs.readFileSync(files[i] , 'utf8');
    }

    return fileSrc;

};

exports.appServer = function() {

    var app = express();


    //app.use(helmet());



    app.get("*", function(req, res, next) {
        var url = req.url
        console.log('APP REQUESTING ', url);
        if ( /\.html/i.test(url) ) {
            //this is a view
            console.log('Getting the view ', url);
        }
        next();
    });


    app.use("/dist", express.static(rootPath + "/dist/client"));
    app.use("/dist2", express.static(rootPath + "/dist/angular"));
    app.use("/views", express.static(rootPath + "/src/views"));
    app.use("/node_modules", express.static(rootPath + "/node_modules"));
    /*app.get('/', function(req, res, next) {
        var data = getClientHtml();
        return res.end(data);
    });*/

    app.get('/favicon.ico', function(req, res, next) {
        return res.send('');
    });

    return app;

};

exports.restApiMiddleWare = function(app) {


    app.get("*", function(req, res, next) {
        var url = req.url
        console.log('APP REQUESTING ', url);
        if ( ! /\.html/i.test(url) ) {
            //this is a view
            console.log('This is probably a rest API call ', url);


        }
        next();
    });

    var getProducts = function(req, res) {

        var options = {
            host: 'fake-response.appspot.com',
            port: 80,
            path: '/?sleep=1'
        };

        http.get(options, function(response) {
            return res.end(JSON.stringify([
                {
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
        return getProducts(req, res);
    });

    app.get('/products', function(req, res, next) {
        return getProducts(req, res);
    });

    return app;

};