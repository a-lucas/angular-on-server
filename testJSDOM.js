var Contextify = require('contextify');
var fs = require('fs');
var jsdom = require("jsdom");

var files = [
    //'./libs/angular.min.js',
   // './libs/angular-resource.min.js',
    './dist/client/app.js'
];

var fileSrc = [];

for(var i in files) {
    fileSrc[i] = fs.readFileSync(files[i] , 'utf8');
}


function logObject(name, obj, level) {
    if (!level) {
        level=0;
    }
    console.log('');
    console.log('///////////', name, '////////////');
    console.log('');

    if (typeof obj === 'string' || typeof obj === 'number') {
        console.log('value = ', obj);
    }

    if (typeof obj !== 'string') {

        for (var i in obj) {
            switch (typeof obj[i]) {
                case 'string':
                case 'number':
                    console.log('   ', i, '   =>   ', obj[i]);
                    break;
                case 'object':
                    if (level >=1) {
                        console.log('   ', i, '   =>   //// OBJECT ////');
                        logObject ( i,  obj[i], level -1 );
                    } else {
                        console.log('   ', i, '   =>   ', typeof obj[i]);
                    }
                    break;
                case 'function':
                case 'undefined':
                    break;
                default:
                    console.log('   ', i, '   =>   ', typeof obj[i]);
            }
        }
    }
}


jsdom.env({
    html:'<html><body><p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom\'s Homepage</a></p></body></html>',
    script: ["http://code.jquery.com/jquery.js"],
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    done: function (errors, window) {

        Contextify(window);
        //window.run("console.log('test', window);");

        //logObject('window.document.chidlren[0].innerHTML', window.document.children[0].innerHTML);
        window.close();
    }
});


c_window = Contextify({console : console});
c_window.window = c_window.getGlobal();
c_window.window.scrollTo = function() {};

config = {
    file: 'index.server.html',
    src: fileSrc,
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    created: function(err, window) {
        window.scrollTo = function(){};
    },
    done: function(err, window) {
        console.log('done', err);

        setTimeout(function() {

            e = window.document.body;

            c_window.window =  Object.assign( c_window.window, window);
            c_window.angular.bootstrap( c_window.document, ["myApp"] );

            scope = c_window.angular.element(c_window.document).scope();
            scope.$apply(function() {
                scope.setLocation('/home/antoine/');
                return void 0;
            });

            //c_window.run('angular.bootstrap( document, ["myApp"] );');
            //c_window.run('console.log(document.children[0].innerHTML);console.log(document.innerHTML);');

            setTimeout( function() {


                logObject('window.document.chidlren[0].innerHTML', window.document.children[0].innerHTML);

            }, 100 );

            return;

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




return;

console.log(window);

window.__myObject = { foo: "bar" };
Contextify(sandbox);
window.run('console.log(prop1);');
window.dispose();
return;


var scriptEl = window.document.createElement("script");
scriptEl.src = "anotherScript.js";
window.document.body.appendChild(scriptEl);



var Contextify = require('contextify');
var sandbox = { console : console, prop1 : 'prop1'};
Contextify(sandbox);
sandbox.run('console.log(prop1);');
sandbox.dispose();


return;



var fs = require("fs");
var jsdom = require("jsdom");

var indexHTML = fs.readFileSync('index.es7.html', 'utf8');

/*
var doc = jsdom.jsdom("<html><body></body></html>", jsdom.level(1, "core"), {
    done: function() {
        console.log('done');
    }
});

return;
var doc = jsdom(indexHTML, null, {
    features: {
        FetchExternalResources : ["script"],
        ProcessExternalResources: ["script"]
    },
});
*/



var config = {
    file: '',
    features: {

    },
    done: function(err, window) {
        console.log('done', err);
        window.close();
    },
    scripts: [

    ],
    document: {
        referer: '',
        cookie: 'key=value; expires=Wed, Sep 21 2011 12:00:00 GMT; path=/',
        cookieDomain: '127.0.0.1'

    }
};

return;

/*
jsdom.env(
    "https://iojs.org/dist/",
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
        console.log("there have been", window.$("a").length - 4, "io.js releases!");
    }
);
*/

var sources = [
    './libs/angular.min.js',
    './libs/angular-resource.min.js',
    './dist/client/app.js'
];

var fileData = [];
for (var i in sources) {
    fileData[i] = fs.readFileSync(sources[i], "utf-8");
}

var indexHTML = fs.readFileSync('index.es7.html', 'utf8');

var config = {
    file: 'index.es7.html',
    scripts: sources,
    done: function (err, window) {
        console.log('Done');
        if (err) {
            console.log(err);
            return;
        }
        //console.log('angular = ', window.angular);

        if (typeof window.document.innerHTML !== 'undefined') {
            console.log((window.document.innerHTML));
            window.close();
            return;
        }


        window.angular.bootstrap(window.document);

        if (typeof window.document.innerHTML !== 'undefined') {
            console.log((window.document.innerHTML));
            window.close();
            return;
        }


        console.log('document = ', window);
        window.close();
    },
    onload: function() {
        console.log('onLoad');
    },
    created: function() {
        console.log('created');
    },
};

jsdom.env(config);
