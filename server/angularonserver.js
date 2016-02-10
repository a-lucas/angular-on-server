var Contextify = require('contextify');
var fs = require('fs');
var jsdom = require("jsdom");
var preboot = require('preboot');
var files = [
  //'./libs/angular.min.js',
  // './libs/angular-resource.min.js',
  './dist/client/app.js'
];

var fileSrc = [];

for(var i in files) {
  fileSrc[i] = fs.readFileSync(files[i] , 'utf8');
}

function log() {
  var str = '';
  for(var i in arguments) {
    if (typeof arguments[i] === 'string' || typeof arguments[i] === 'number') { str = str + " " + arguments[i];}
  }
  console.log(str);
}

function logObject(name, obj, level, force) {
  if (!force) force = false;
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
            logObject ( i,  obj[i], level -1, force);
          } else {
            console.log('   ', i, '   =>   ', typeof obj[i]);
          }
          break;
        case 'function':
        case 'undefined':
            if (force) {
              console.log('   ', i, '   =>   ', typeof obj[i]);
            }
          break;
        default:
          console.log('   ', i, '   =>   ', typeof obj[i]);
      }
    }
  }
}

var http = require('http');

var express = require('express');

var fs = require('fs');

delay = function(ms, func) {
  return setTimeout(func, ms);
};

interval = function(ms, func) {
  return setInterval(func, ms);
};

app = express();

var rootPath = __dirname + '/..';

app.use("/dist", express.static(rootPath + "/dist/client"));
app.use("/views", express.static(rootPath + "/src/views"));
//app.use("/libs", express.static(__dirname + "/libs"));

function  getClientHtml() {
  return fs.readFileSync('index.es7.html', 'utf8');
}


function getServerHtml() {
  return fs.readFileSync('index.server.html', 'utf8');
}

app.get('/', function(req, res, next) {
  var data = getClientHtml();
  console.log(data);
  return res.end(data);
});

/***
 * VIEWS
 */
products = fs.readFileSync('./src/views/products.html');
todos = fs.readFileSync('./src/views/products.html');

app.get('//products.html', function(req, res, next) {
  return res.end(products);
});

app.get('//todos.html', function(req, res, next) {
  return res.end(todos);
});


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

c_window = Contextify({console : console});
c_window.window = c_window.getGlobal();
c_window.window.scrollTo = function() {};

//app.set('view engine', 'hbs');

app.get("*", function(req, res, next) {



  var url = req.url;
  log('Getting *, ',url);

  //return res.end( getClientHtml());

  config = {
    //file: 'index.server.html',
    file: 'index.es7.html',
    src: fileSrc,
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

      c_window.angular.bootstrap(c_window.document, ["myApp"]);
      e = c_window.window.document.getElementById('mainDiv');
      scope = c_window.window.angular.element(c_window.document).scope();

      //preboot.getBrowserCode(opts)  // can pass callback to second param if you don't like promises
      //    .then(function (clientCode) {
            //c_window.window = Object.assign(c_window.window, window);

            /*c_window.angular.bootstrap(c_window.document, ["myApp"]);

            e = c_window.window.document.getElementById('mainDiv');
            scope = c_window.window.angular.element(c_window.document).scope();
            */
            //logObject('scope', scope, 0, true);


            setTimeout(function () {
              //logObject('window.document.chidlren[0].innerHTML', window.document.children[0].innerHTML);

              var html = '<html id="myApp">'
                  + c_window.window.document.children[0].innerHTML
                  + '</html>';
              console.log(html);

              res.end (html);
      }, 1000);
          //});

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


  /*old
  var e, scope;
  var url = req.url;
  document = jsdom(html);


  window = document.createWindow({
    localPrefix: 'http://localhost:3002' + url
  });
  e = window.document.getElementById('mainDiv');
  if (window.angular != null) {
    console.log('Angular is defined');

    scope = window.angular.element(e).scope();
    scope.$apply(function() {
      scope.setLocation(req.url);
      return void 0;
    });
    return delay(50, function() {
      console.log(window.document.innerHTML);
      return res.end(window.document.innerHTML);
    });
  } else {
    console.log('window.angular is not defined');
    console.log(window.document.innerHTML);
    return res.end(window.document.innerHTML);

  }
  */

app.listen(3002);

console.log('Listening on port 3002');

