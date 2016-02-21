/**
 * Created by antoine on 16/02/16.
 */

var Contextify = require('contextify');
var fs = require('fs');
var path = require('path');

var rootPath = __dirname + '/../';

exports.getClientJS = function() {
    var files = [

       // path.resolve( rootPath + '/build-angular-engine/angular.js' ),
       // path.resolve( rootPath + '/build-angular-engine/angular-resource.js' ),
       // path.resolve( rootPath + '/build-angular-engine/angular-route.js' ),
        path.resolve( rootPath + '/dist/client/app.js' ),
    ];
    var fileSrc = [];
    for(var i in files) {
        fileSrc[i] = fs.readFileSync(files[i] , 'utf8');
    }
    return fileSrc;
};

exports.getContext = function(){
    c_window = Contextify({
        console : console
    });
    c_window.window = c_window.getGlobal();
    c_window.window.fs = fs;
    return c_window;
}

//rendering = true;
//console.log(html)

exports.closeSession = function( c_window, window ) {
    if (!window) {
        throw 'No window provided';
    }
    window.close();
    if (c_window) {
        try {
            c_window.dispose();
        }
        catch (e) {
            console.error('c_window.dispose() error');
        }
    } else {
        console.error('No c_window provided');
    }
}

exports.getHTML = function(c_window, timeouts) {

    var scope = c_window.window.angular.element(c_window.document).scope();
    scope.$apply();

    var html = '<html id="myApp">'
        + c_window.window.document.children[0].innerHTML
        + '</html>';

    for (var i in timeouts) {
        clearTimeout( timeouts[i]);
    }
    return html;
};