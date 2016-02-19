(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by antoine on 17/02/16.
 */

var AngularClient = exports.AngularClient = function AngularClient(angular, document, timeout) {
    var x = document.head.getElementsByTagName("style");
    for (var i = x.length - 1; i >= 0; i--) {
        x[i].parentElement.removeChild(x[i]);
    }

    // empty the prerender div
    var view = document.getElementById('prerendered');
    if (view) {
        view.innerHTML = '';
    } else {
        var view = '<div id="prerendered"></div>';
        document.body.appendChild(view);
    }

    var html = angular.element(document.getElementById('myApp'));

    setTimeout(function () {
        angular.bootstrap(html, ['myApp']);
    }, timeout);
};

},{}],2:[function(require,module,exports){
'use strict';

var _Error = require('./controllers/Error');

var _Error2 = _interopRequireDefault(_Error);

var _Main = require('./controllers/Main');

var _Main2 = _interopRequireDefault(_Main);

var _Todo = require('./controllers/Todo');

var _Todo2 = _interopRequireDefault(_Todo);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _client = require('../angular/client');

var _ProductList = require('./directives/ProductList');

var _ProductList2 = _interopRequireDefault(_ProductList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import angular from 'angular';
//import ngResource from 'angular-resource';
//import ngRoute from 'angular-route';

var moduleName = 'myApp';

window[moduleName] = angular.module(moduleName, ['ngResource', 'ngRoute']).config(_routes2.default).controller('MainCtrl', _Main2.default).controller('TodoCtrl', _Todo2.default).controller('ErrorCtrl', _Error2.default).directive('productList', _ProductList2.default);

if (typeof window.onServer === 'undefined') {
                        (0, _client.AngularClient)(angular, document, 50000);
}

},{"../angular/client":1,"./controllers/Error":3,"./controllers/Main":4,"./controllers/Todo":5,"./directives/ProductList":6,"./routes":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by antoine on 17/02/16.
 */

var ErrorCtrl = function ErrorCtrl($log) {
    _classCallCheck(this, ErrorCtrl);

    this.throwError = function (text) {
        throw new Error(text);
    };

    this.throwException = function (text) {
        throw text;
    };

    var error1 = 'Catchable Error()';
    var error2 = 'Catchable Exception()';
    var error3 = 'Uncatchable Error() - should crash the app.';

    $log.log('Will....' + error1);

    try {
        this.throwError(error1);
    } catch (e1) {
        $log.log('I catched an Error/Exception: ' + e1);
        try {
            $log.log('Will....' + error2);
            this.throwException(error2);
        } catch (e2) {
            $log.log('I catched an Error/Exception: ' + e2);
            $log.log('Will....' + error3);
            this.throwException(error3);
        }
    }
};

exports.default = ErrorCtrl;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by antoine on 9/02/16.
 */

var MainCtrl = function MainCtrl($log) {
    _classCallCheck(this, MainCtrl);

    this.title = 'Angular Es6 revisited';

    $log.log('I am a log', 'with two parameters');
    $log.warn('I am a warn');
    $log.info('I am an info');
    $log.error('I am error with an object', {
        name: 'value'
    });
};

exports.default = MainCtrl;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by antoine on 9/02/16.
 */

var TodoCtrl = function TodoCtrl() {
    //console.log('TodoCtrl Loaded', this);

    var _this = this;

    _classCallCheck(this, TodoCtrl);

    this.addTodo = function () {
        _this.todos.push({ text: _this.todoText, done: false });
        _this.todoText = '';
    };

    this.title = "Todos title";
    this.todos = [{ text: 'learn angular', done: true }, { text: 'build an angular app', done: false }];
    this.todoText = '';
};

exports.default = TodoCtrl;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($http) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        //scope: { products: { data: [ { name: 'test', price: 1 }] } },
        template: '<li ng-repeat="product in products">{{product.name}} {{product.price}}</li>',
        link: function link(scope, element, attrs) {

            $http.get('/products').success(function (data) {
                //console.log(data);
                scope.products = data;
            });
        }
    };
};

;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($routeProvider, $locationProvider, $sceProvider, $provide) {

    if (typeof window.onServer === 'undefined') {
        console.log('ON CLIENT !!!');
    }

    if (typeof window.onServer !== 'undefined') {
        console.log('ON SERVER !!!');
        InjectServer($provide);
    }

    $sceProvider.enabled(false);

    $routeProvider.when('/Main', {
        templateUrl: './views/products.html',
        controller: _Main2.default,
        controllerAs: 'vm'
    });

    $routeProvider.when('/Todo', {
        templateUrl: './views/todos.html',
        controller: _Todo2.default,
        controllerAs: 'vm'
    });

    $routeProvider.when('/Error', {
        templateUrl: './views/error.html',
        controller: _Error2.default,
        controllerAs: 'vm'
    });

    $routeProvider.otherwise('/Main');

    $locationProvider.html5Mode(true);
};

var _Main = require('./controllers/Main');

var _Main2 = _interopRequireDefault(_Main);

var _Todo = require('./controllers/Todo');

var _Todo2 = _interopRequireDefault(_Todo);

var _Error = require('./controllers/Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Created by antoine on 9/02/16.
 */
;

//import {InjectServer} from '../angular/server';

},{"./controllers/Error":3,"./controllers/Main":4,"./controllers/Todo":5}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbmd1bGFyL2NsaWVudC5qcyIsInNyYy9hcHAuanMiLCJzcmMvY29udHJvbGxlcnMvRXJyb3IuanMiLCJzcmMvY29udHJvbGxlcnMvTWFpbi5qcyIsInNyYy9jb250cm9sbGVycy9Ub2RvLmpzIiwic3JjL2RpcmVjdGl2ZXMvUHJvZHVjdExpc3QuanMiLCJzcmMvcm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDS08sSUFBTSx3Q0FBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixPQUFwQixFQUFnQztBQUN6RCxRQUFJLElBQUksU0FBUyxJQUFULENBQWMsb0JBQWQsQ0FBbUMsT0FBbkMsQ0FBSixDQURxRDtBQUV6RCxTQUFLLElBQUksSUFBSSxFQUFFLE1BQUYsR0FBVyxDQUFYLEVBQWMsS0FBSyxDQUFMLEVBQVEsR0FBbkMsRUFBd0M7QUFDcEMsVUFBRSxDQUFGLEVBQUssYUFBTCxDQUFtQixXQUFuQixDQUErQixFQUFFLENBQUYsQ0FBL0IsRUFEb0M7S0FBeEM7OztBQUZ5RCxRQU9yRCxPQUFPLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFQLENBUHFEO0FBUXpELFFBQUksSUFBSixFQUFVO0FBQ04sYUFBSyxTQUFMLEdBQWlCLEVBQWpCLENBRE07S0FBVixNQUdLO0FBQ0QsWUFBSSxPQUFPLDhCQUFQLENBREg7QUFFRCxpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixJQUExQixFQUZDO0tBSEw7O0FBUUEsUUFBSSxPQUFPLFFBQVEsT0FBUixDQUFnQixTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBaEIsQ0FBUCxDQWhCcUQ7O0FBa0J6RCxlQUFZLFlBQVc7QUFDbkIsZ0JBQVEsU0FBUixDQUFrQixJQUFsQixFQUF3QixDQUFDLE9BQUQsQ0FBeEIsRUFEbUI7S0FBWCxF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R0FBTixDQUFVLFdBQVYsRUFBdUIsT0FBdkIsQ0FBK0IsVUFBVSxJQUFWLEVBQWdCOztBQUUzQyxzQkFBTSxRQUFOLEdBQWlCLElBQWpCLENBRjJDO2FBQWhCLENBQS9CLENBRm1DO1NBQWpDO0tBTlYsQ0FEMkI7Q0FBaEI7O0FBZWQ7Ozs7Ozs7Ozs0QkNOYyxBQUFTLGdCQUFULEFBQXlCLG1CQUF6QixBQUE0QyxjQUE1QyxBQUEwRDs7UUFFaEUsT0FBTyxPQUFBLEFBQU8sYUFBZCxBQUEyQjtnQkFDNUIsQUFBUSxJQURaLEFBQTZDLEFBQ3pDLEFBQVksQUFHaEI7OztRQUFLLE9BQU8sT0FBQSxBQUFPLGFBQWQsQUFBMkI7Z0JBQzVCLEFBQVEsSUFEaUMsQUFDekMsQUFBWSxBQUNaO3FCQUZKLEFBQTZDLEFBQ3pDLEFBQ0EsQUFBYSxBQUdqQjs7O2lCQUFBLEFBQWEsUUFYa0UsQUFXL0UsQUFBcUIsQUFFckI7O21CQUFBLEFBQWUsS0FBZixBQUFvQixTQUFTLEFBQ3pCO3FCQUFBLEFBQWEsQUFDYjsyQkFGeUIsQUFHekI7c0JBaEIyRSxBQUUvRSxBQVdBLEFBR0ksQUFBYyxBQUdsQjs7O21CQUFBLEFBQWUsS0FBZixBQUFvQixTQUFTLEFBQ3pCO3FCQUFBLEFBQWEsQUFDYjsyQkFGeUIsQUFHekI7c0JBdEIyRSxBQW1CL0UsQUFHSSxBQUFjLEFBR2xCOzs7bUJBQUEsQUFBZSxLQUFmLEFBQW9CLFVBQVUsQUFDMUI7cUJBQUEsQUFBYSxBQUNiOzRCQUYwQixBQUcxQjtzQkE1QjJFLEFBeUIvRSxBQUdJLEFBQWMsQUFHbEI7OzttQkFBQSxBQUFlLFVBL0JnRSxBQStCL0UsQUFBeUIsQUFHekI7O3NCQUFBLEFBQWtCLFVBbENQLEFBQW9FLEFBa0MvRSxBQUE0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiAxNy8wMi8xNi5cbiAqL1xuXG5cbmV4cG9ydCBjb25zdCBBbmd1bGFyQ2xpZW50ID0gKGFuZ3VsYXIsIGRvY3VtZW50LCB0aW1lb3V0KSA9PiB7XG4gICAgdmFyIHggPSBkb2N1bWVudC5oZWFkLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3R5bGVcIik7XG4gICAgZm9yICh2YXIgaSA9IHgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgeFtpXS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHhbaV0pO1xuICAgIH1cblxuLy8gZW1wdHkgdGhlIHByZXJlbmRlciBkaXZcbiAgICB2YXIgdmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVyZW5kZXJlZCcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICAgIHZpZXcuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdmlldyA9ICc8ZGl2IGlkPVwicHJlcmVuZGVyZWRcIj48L2Rpdj4nO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXcpO1xuICAgIH1cblxuICAgIHZhciBodG1sID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteUFwcCcpKTtcblxuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcChodG1sLCBbJ215QXBwJ10pO1xuICAgIH0sIHRpbWVvdXQpO1xuXG59XG4iLCJpbXBvcnQgRXJyb3JDdHJsIGZyb20gJy4vY29udHJvbGxlcnMvRXJyb3InO1xuaW1wb3J0IE1haW5DdHJsICBmcm9tICcuL2NvbnRyb2xsZXJzL01haW4nO1xuaW1wb3J0IFRvZG9DdHJsICBmcm9tICcuL2NvbnRyb2xsZXJzL1RvZG8nO1xuaW1wb3J0IFJvdXRlcyBmcm9tICcuL3JvdXRlcyc7XG4vL2ltcG9ydCBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuLy9pbXBvcnQgbmdSZXNvdXJjZSBmcm9tICdhbmd1bGFyLXJlc291cmNlJztcbi8vaW1wb3J0IG5nUm91dGUgZnJvbSAnYW5ndWxhci1yb3V0ZSc7XG5cbmltcG9ydCB7QW5ndWxhckNsaWVudH0gZnJvbSAnLi4vYW5ndWxhci9jbGllbnQnO1xuaW1wb3J0IFByb2R1Y3RMaXN0IGZyb20gJy4vZGlyZWN0aXZlcy9Qcm9kdWN0TGlzdCc7XG5cbnZhciBtb2R1bGVOYW1lPSdteUFwcCc7XG5cblxuXG53aW5kb3dbbW9kdWxlTmFtZV0gPSBhbmd1bGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAubW9kdWxlKG1vZHVsZU5hbWUsIFsnbmdSZXNvdXJjZScsICduZ1JvdXRlJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29uZmlnKFJvdXRlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250cm9sbGVyKCdNYWluQ3RybCcsIE1haW5DdHJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRyb2xsZXIoJ1RvZG9DdHJsJywgVG9kb0N0cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udHJvbGxlcignRXJyb3JDdHJsJywgRXJyb3JDdHJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRpcmVjdGl2ZSgncHJvZHVjdExpc3QnLFByb2R1Y3RMaXN0KTtcblxuXG5cbmlmICggdHlwZW9mIHdpbmRvdy5vblNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBBbmd1bGFyQ2xpZW50KGFuZ3VsYXIsIGRvY3VtZW50LCA1MDAwMCk7XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiAxNy8wMi8xNi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JDdHJsIHtcblxuICAgIGNvbnN0cnVjdG9yKCRsb2cpIHtcblxuICAgICAgICBjb25zdCBlcnJvcjEgPSAnQ2F0Y2hhYmxlIEVycm9yKCknO1xuICAgICAgICBjb25zdCBlcnJvcjIgPSAnQ2F0Y2hhYmxlIEV4Y2VwdGlvbigpJztcbiAgICAgICAgY29uc3QgZXJyb3IzID0gJ1VuY2F0Y2hhYmxlIEVycm9yKCkgLSBzaG91bGQgY3Jhc2ggdGhlIGFwcC4nO1xuXG4gICAgICAgICRsb2cubG9nKCdXaWxsLi4uLicgKyBlcnJvcjEpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RXJyb3IoZXJyb3IxKVxuICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgJGxvZy5sb2coJ0kgY2F0Y2hlZCBhbiBFcnJvci9FeGNlcHRpb246ICcgKyBlMSApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAkbG9nLmxvZygnV2lsbC4uLi4nICsgZXJyb3IyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93RXhjZXB0aW9uKGVycm9yMik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICRsb2cubG9nKCdJIGNhdGNoZWQgYW4gRXJyb3IvRXhjZXB0aW9uOiAnICsgZTIgKTtcbiAgICAgICAgICAgICAgICAkbG9nLmxvZygnV2lsbC4uLi4nICsgZXJyb3IzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93RXhjZXB0aW9uKGVycm9yMyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRocm93RXJyb3IgPSAodGV4dCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGV4dCk7XG4gICAgfTtcblxuICAgIHRocm93RXhjZXB0aW9uID0gKHRleHQpID0+IHtcbiAgICAgICAgdGhyb3cgdGV4dDtcbiAgICB9O1xuXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGFudG9pbmUgb24gOS8wMi8xNi5cbiAqL1xuXG5jbGFzcyBNYWluQ3RybCB7XG4gICAgY29uc3RydWN0b3IoJGxvZyl7XG4gICAgICAgICRsb2cubG9nKCdJIGFtIGEgbG9nJywgJ3dpdGggdHdvIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgJGxvZy53YXJuKCdJIGFtIGEgd2FybicpO1xuICAgICAgICAkbG9nLmluZm8oJ0kgYW0gYW4gaW5mbycpO1xuICAgICAgICAkbG9nLmVycm9yKCdJIGFtIGVycm9yIHdpdGggYW4gb2JqZWN0Jywge1xuICAgICAgICAgICAgbmFtZTogJ3ZhbHVlJ1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHRpdGxlID0gJ0FuZ3VsYXIgRXM2IHJldmlzaXRlZCc7XG59XG5leHBvcnQgZGVmYXVsdCBNYWluQ3RybDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiA5LzAyLzE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9DdHJsIHtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1RvZG9DdHJsIExvYWRlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFRvZG8gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh7dGV4dDp0aGlzLnRvZG9UZXh0LCBkb25lOmZhbHNlfSk7XG4gICAgICAgIHRoaXMudG9kb1RleHQgPSAnJztcbiAgICB9O1xuXG5cbiAgICB0aXRsZSA9IFwiVG9kb3MgdGl0bGVcIjtcblxuICAgIHRvZG9zID0gW1xuICAgICAgICB7dGV4dDonbGVhcm4gYW5ndWxhcicsIGRvbmU6dHJ1ZX0sXG4gICAgICAgIHt0ZXh0OididWlsZCBhbiBhbmd1bGFyIGFwcCcsIGRvbmU6ZmFsc2V9XTtcblxuICAgIHRvZG9UZXh0ID0gJyc7XG5cblxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgICAgIC8vc2NvcGU6IHsgcHJvZHVjdHM6IHsgZGF0YTogWyB7IG5hbWU6ICd0ZXN0JywgcHJpY2U6IDEgfV0gfSB9LFxuICAgICAgICB0ZW1wbGF0ZTogJzxsaSBuZy1yZXBlYXQ9XCJwcm9kdWN0IGluIHByb2R1Y3RzXCI+e3twcm9kdWN0Lm5hbWV9fSB7e3Byb2R1Y3QucHJpY2V9fTwvbGk+JyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9kdWN0cycpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiA5LzAyLzE2LlxuICovXG5pbXBvcnQgTWFpbkN0cmwgZnJvbSAnLi9jb250cm9sbGVycy9NYWluJztcbmltcG9ydCBUb2RvQ3RybCBmcm9tICcuL2NvbnRyb2xsZXJzL1RvZG8nO1xuaW1wb3J0IEVycm9yQ3RybCBmcm9tICcuL2NvbnRyb2xsZXJzL0Vycm9yJztcblxuLy9pbXBvcnQge0luamVjdFNlcnZlcn0gZnJvbSAnLi4vYW5ndWxhci9zZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRzY2VQcm92aWRlciwgJHByb3ZpZGUpIHtcblxuICAgIGlmICggdHlwZW9mIHdpbmRvdy5vblNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09OIENMSUVOVCAhISEnKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB3aW5kb3cub25TZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPTiBTRVJWRVIgISEhJyk7XG4gICAgICAgIEluamVjdFNlcnZlcigkcHJvdmlkZSk7XG4gICAgfVxuXG4gICAgJHNjZVByb3ZpZGVyLmVuYWJsZWQoZmFsc2UpO1xuXG4gICAgJHJvdXRlUHJvdmlkZXIud2hlbignL01haW4nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9kdWN0cy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogTWFpbkN0cmwsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgIH0pO1xuXG4gICAgJHJvdXRlUHJvdmlkZXIud2hlbignL1RvZG8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90b2Rvcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogVG9kb0N0cmwsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgIH0pO1xuXG4gICAgJHJvdXRlUHJvdmlkZXIud2hlbignL0Vycm9yJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZXJyb3IuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IEVycm9yQ3RybCxcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nXG4gICAgfSk7XG5cbiAgICAkcm91dGVQcm92aWRlci5vdGhlcndpc2UoJy9NYWluJyk7XG5cblxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxufTsiXX0=
