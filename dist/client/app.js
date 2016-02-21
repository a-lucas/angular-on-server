(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Error = require('./controllers/Error');

var _Error2 = _interopRequireDefault(_Error);

var _Main = require('./controllers/Main');

var _Main2 = _interopRequireDefault(_Main);

var _Todo = require('./controllers/Todo');

var _Todo2 = _interopRequireDefault(_Todo);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _client = require('./client');

var _ProductList = require('./directives/ProductList');

var _ProductList2 = _interopRequireDefault(_ProductList);

function _interopRequireDefault(obj) {
                        return obj && obj.__esModule ? obj : { default: obj };
}

var moduleName = 'myApp';

window[moduleName] = angular.module(moduleName, ['ngResource', 'ngRoute']).config(_routes2.default).controller('MainCtrl', _Main2.default).controller('TodoCtrl', _Todo2.default).controller('ErrorCtrl', _Error2.default).directive('productList', _ProductList2.default);

if (typeof window.onServer === 'undefined') {
                        (0, _client.AngularClient)(angular, document, 100);
}

},{"./client":2,"./controllers/Error":3,"./controllers/Main":4,"./controllers/Todo":5,"./directives/ProductList":6,"./routes":7}],2:[function(require,module,exports){
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

    // Should register within EngineQueue
    setTimeout(function () {
        angular.bootstrap(html, ['myApp']);
    }, timeout);
};

},{}],3:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Created by antoine on 9/02/16.
 */

var MainCtrl = function MainCtrl($log) {
    _classCallCheck(this, MainCtrl);

    this.title = 'Angular Es6 revisited';

    $log.log('I am a log', 'with two parameters');
    $log.warn('I am a warn');
    $log.info('I am an info');
    /*$log.error('I am error with an object', {
        name: 'value'
    });*/
};

exports.default = MainCtrl;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Created by antoine on 9/02/16.
 */

var TodoCtrl = function TodoCtrl() {
    var _this = this;

    _classCallCheck(this, TodoCtrl);

    this.addTodo = function () {
        _this.todos.push({ text: _this.todoText, done: false });
        _this.todoText = '';
    };

    this.title = "Todos title";
    this.todos = [{ text: 'learn angular', done: true }, { text: 'build an angular app', done: false }];
    this.todoText = '';

    console.log('TodoCtrl Loaded', this);
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

exports.default = function ($routeProvider, $locationProvider, $sceProvider) {

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

},{"./controllers/Error":3,"./controllers/Main":4,"./controllers/Todo":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NsaWVudC5qcyIsInNyYy9jb250cm9sbGVycy9FcnJvci5qcyIsInNyYy9jb250cm9sbGVycy9NYWluLmpzIiwic3JjL2NvbnRyb2xsZXJzL1RvZG8uanMiLCJzcmMvZGlyZWN0aXZlcy9Qcm9kdWN0TGlzdC5qcyIsInNyYy9yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUUEsSUFBSSxhQUFBLEFBQVc7O0FBRWYsT0FBQSxBQUFPLGNBQWMsUUFBQSxBQUNJLE9BREosQUFDVyxZQUFZLENBQUEsQUFBQyxjQUR4QixBQUN1QixBQUFlLFlBRHRDLEFBRUkseUJBRkosQUFHSSxXQUhKLEFBR2UsNEJBSGYsQUFJSSxXQUpKLEFBSWUsNEJBSmYsQUFLSSxXQUxKLEFBS2UsOEJBTGYsQUFNSSxVQU5KLEFBTWMsNkJBTm5DOztBQVVBLElBQUssT0FBTyxPQUFBLEFBQU8sYUFBZCxBQUEyQixhQUFhLEFBQ3pDO21EQUFBLEFBQWMsU0FBZCxBQUF1QixVQUQzQixBQUE2QyxBQUN6QyxBQUFpQzs7Ozs7Ozs7Ozs7OztBQ2hCOUIsSUFBTSx3Q0FBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixPQUFwQixFQUFnQztBQUN6RCxRQUFJLElBQUksU0FBUyxJQUFULENBQWMsb0JBQWQsQ0FBbUMsT0FBbkMsQ0FBSixDQURxRDtBQUV6RCxTQUFLLElBQUksSUFBSSxFQUFFLE1BQUYsR0FBVyxDQUFYLEVBQWMsS0FBSyxDQUFMLEVBQVEsR0FBbkMsRUFBd0M7QUFDcEMsVUFBRSxDQUFGLEVBQUssYUFBTCxDQUFtQixXQUFuQixDQUErQixFQUFFLENBQUYsQ0FBL0IsRUFEb0M7S0FBeEM7OztBQUZ5RCxRQU9yRCxPQUFPLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFQLENBUHFEO0FBUXpELFFBQUksSUFBSixFQUFVO0FBQ04sYUFBSyxTQUFMLEdBQWlCLEVBQWpCLENBRE07S0FBVixNQUdLO0FBQ0QsWUFBSSxPQUFPLDhCQUFQLENBREg7QUFFRCxpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixJQUExQixFQUZDO0tBSEw7O0FBUUEsUUFBSSxPQUFPLFFBQVEsT0FBUixDQUFnQixTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBaEIsQ0FBUDs7O0FBaEJxRCxjQW1CekQsQ0FBWSxZQUFXO0FBQ25CLGdCQUFRLFNBQVIsQ0FBa0IsSUFBbEIsRUFBd0IsQ0FBQyxPQUFELENBQXhCLEVBRG1CO0tBQVgsRUFFVCxPQUZILEVBbkJ5RDtDQUFoQzs7Ozs7Ozs7Ozs7Ozs7O0lDRlIsWUFFakIsU0FGaUIsU0FFakIsQ0FBWSxJQUFaLEVBQWtCOzBCQUZELFdBRUM7O1NBd0JsQixhQUFhLFVBQUMsSUFBRCxFQUFVO0FBQ25CLGNBQU0sSUFBSSxLQUFKLENBQVUsSUFBVixDQUFOLENBRG1CO0tBQVYsQ0F4Qks7O1NBNEJsQixpQkFBaUIsVUFBQyxJQUFELEVBQVU7QUFDdkIsY0FBTSxJQUFOLENBRHVCO0tBQVYsQ0E1QkM7O0FBRWQsUUFBTSxTQUFTLG1CQUFULENBRlE7QUFHZCxRQUFNLFNBQVMsdUJBQVQsQ0FIUTtBQUlkLFFBQU0sU0FBUyw2Q0FBVCxDQUpROztBQU1kLFNBQUssR0FBTCxDQUFTLGFBQWEsTUFBYixDQUFULENBTmM7O0FBUWQsUUFBSTtBQUNBLGFBQUssVUFBTCxDQUFnQixNQUFoQixFQURBO0tBQUosQ0FFRSxPQUFPLEVBQVAsRUFBVztBQUNULGFBQUssR0FBTCxDQUFTLG1DQUFtQyxFQUFuQyxDQUFULENBRFM7QUFFVCxZQUFJO0FBQ0EsaUJBQUssR0FBTCxDQUFTLGFBQWEsTUFBYixDQUFULENBREE7QUFFQSxpQkFBSyxjQUFMLENBQW9CLE1BQXBCLEVBRkE7U0FBSixDQUdFLE9BQU8sRUFBUCxFQUFXO0FBQ1QsaUJBQUssR0FBTCxDQUFTLG1DQUFtQyxFQUFuQyxDQUFULENBRFM7QUFFVCxpQkFBSyxHQUFMLENBQVMsYUFBYSxNQUFiLENBQVQsQ0FGUztBQUdULGlCQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFIUztTQUFYO0tBTEo7Q0FWTjs7a0JBRmlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQ2Ysb0JBQUEsQUFDRixTQUFBLEFBQVk7MEJBRFYsQUFDZTs7U0FZakIsUUFaaUIsQUFFYixBQVVJOztTQVZKLEFBQUssSUFBTCxBQUFTLGNBRkksQUFFYixBQUF1QixBQUN2QjtTQUFBLEFBQUssS0FIUSxBQUdiLEFBQVUsQUFDVjtTQUFBLEFBQUssS0FKVCxBQUFpQixBQUliLEFBQVU7Ozs7OztrQkFVSDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2ZNLG9CQUFBLEFBRWpCOzs7MEJBRmlCLEFBRUo7O1NBSWI7Y0FDSSxBQUFLLE1BQUwsQUFBVyxLQUFLLEVBQUMsTUFBSyxNQUFBLEFBQUssVUFBVSxNQUR6QixBQUNaLEFBQXFDLEFBQUssQUFDMUM7Y0FBQSxBQUFLLFdBTkksQUFJSCxBQUFNLEFBQ1osQUFDQSxBQUFnQjs7O1NBSXBCLFFBVmEsQUFVTDtTQUVSLFFBQVEsQ0FDSixFQUFDLE1BQUEsQUFBSyxpQkFBaUIsTUFEbkIsQUFDbUIsQUFBSyxRQUM1QixFQUFDLE1BQUEsQUFBSyx3QkFBd0IsTUFkckIsQUFZTCxBQUUwQixBQUFLO1NBRXZDLFdBaEJhLEFBQ1QsQUFlTzs7WUFmUCxBQUFRLElBQVIsQUFBWSxtQkFEaEIsQUFBYSxBQUNULEFBQStCOzs7a0JBSGxCOzs7Ozs7Ozs7a0JDSk4sVUFBUyxLQUFULEVBQWdCO0FBQzNCLFdBQU87QUFDSCxrQkFBVSxHQUFWO0FBQ0EsaUJBQVMsSUFBVDtBQUNBLG9CQUFZLEtBQVo7O0FBRUEsa0JBQVUsNkVBQVY7QUFDQSxjQUFNLGNBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQixLQUExQixFQUFpQzs7QUFFbkMsa0JBQU0sR0FBTixDQUFVLFdBQVYsRUFBdUIsT0FBdkIsQ0FBK0IsVUFBVSxJQUFWLEVBQWdCOztBQUUzQyxzQkFBTSxRQUFOLEdBQWlCLElBQWpCLENBRjJDO2FBQWhCLENBQS9CLENBRm1DO1NBQWpDO0tBTlYsQ0FEMkI7Q0FBaEI7O0FBZWQ7Ozs7Ozs7Ozs0QkNOYyxBQUFTLGdCQUFULEFBQXlCLG1CQUF6QixBQUE0Qzs7aUJBR3ZELEFBQWEsUUFId0QsQUFHckUsQUFBcUIsQUFFckI7O21CQUFBLEFBQWUsS0FBZixBQUFvQixTQUFTLEFBQ3pCO3FCQUFBLEFBQWEsQUFDYjsyQkFGeUIsQUFHekI7c0JBUmlFLEFBR3JFLEFBRUEsQUFHSSxBQUFjLEFBR2xCOzs7bUJBQUEsQUFBZSxLQUFmLEFBQW9CLFNBQVMsQUFDekI7cUJBQUEsQUFBYSxBQUNiOzJCQUZ5QixBQUd6QjtzQkFkaUUsQUFXckUsQUFHSSxBQUFjLEFBR2xCOzs7bUJBQUEsQUFBZSxLQUFmLEFBQW9CLFVBQVUsQUFDMUI7cUJBQUEsQUFBYSxBQUNiOzRCQUYwQixBQUcxQjtzQkFwQmlFLEFBaUJyRSxBQUdJLEFBQWMsQUFHbEI7OzttQkFBQSxBQUFlLFVBdkJzRCxBQXVCckUsQUFBeUIsQUFHekI7O3NCQUFBLEFBQWtCLFVBMUJQLEFBQTBELEFBMEJyRSxBQUE0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRXJyb3JDdHJsIGZyb20gJy4vY29udHJvbGxlcnMvRXJyb3InO1xuaW1wb3J0IE1haW5DdHJsICBmcm9tICcuL2NvbnRyb2xsZXJzL01haW4nO1xuaW1wb3J0IFRvZG9DdHJsICBmcm9tICcuL2NvbnRyb2xsZXJzL1RvZG8nO1xuaW1wb3J0IFJvdXRlcyBmcm9tICcuL3JvdXRlcyc7XG5cbmltcG9ydCB7IEFuZ3VsYXJDbGllbnQgfSBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgUHJvZHVjdExpc3QgZnJvbSAnLi9kaXJlY3RpdmVzL1Byb2R1Y3RMaXN0JztcblxudmFyIG1vZHVsZU5hbWU9J215QXBwJztcblxud2luZG93W21vZHVsZU5hbWVdID0gYW5ndWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1vZHVsZShtb2R1bGVOYW1lLCBbJ25nUmVzb3VyY2UnLCAnbmdSb3V0ZSddKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmZpZyhSb3V0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udHJvbGxlcignTWFpbkN0cmwnLCBNYWluQ3RybClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250cm9sbGVyKCdUb2RvQ3RybCcsIFRvZG9DdHJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRyb2xsZXIoJ0Vycm9yQ3RybCcsIEVycm9yQ3RybClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kaXJlY3RpdmUoJ3Byb2R1Y3RMaXN0JyxQcm9kdWN0TGlzdCk7XG5cblxuXG5pZiAoIHR5cGVvZiB3aW5kb3cub25TZXJ2ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgQW5ndWxhckNsaWVudChhbmd1bGFyLCBkb2N1bWVudCwgMTAwKTtcbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBhbnRvaW5lIG9uIDE3LzAyLzE2LlxuICovXG5cblxuZXhwb3J0IGNvbnN0IEFuZ3VsYXJDbGllbnQgPSAoYW5ndWxhciwgZG9jdW1lbnQsIHRpbWVvdXQpID0+IHtcbiAgICB2YXIgeCA9IGRvY3VtZW50LmhlYWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdHlsZVwiKTtcbiAgICBmb3IgKHZhciBpID0geC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB4W2ldLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoeFtpXSk7XG4gICAgfVxuXG4vLyBlbXB0eSB0aGUgcHJlcmVuZGVyIGRpdlxuICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXJlbmRlcmVkJyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgICAgdmlldy5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB2aWV3ID0gJzxkaXYgaWQ9XCJwcmVyZW5kZXJlZFwiPjwvZGl2Pic7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlldyk7XG4gICAgfVxuXG4gICAgdmFyIGh0bWwgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215QXBwJykpO1xuXG4gICAgLy8gU2hvdWxkIHJlZ2lzdGVyIHdpdGhpbiBFbmdpbmVRdWV1ZVxuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcChodG1sLCBbJ215QXBwJ10pO1xuICAgIH0sIHRpbWVvdXQpO1xuXG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiAxNy8wMi8xNi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JDdHJsIHtcblxuICAgIGNvbnN0cnVjdG9yKCRsb2cpIHtcblxuICAgICAgICBjb25zdCBlcnJvcjEgPSAnQ2F0Y2hhYmxlIEVycm9yKCknO1xuICAgICAgICBjb25zdCBlcnJvcjIgPSAnQ2F0Y2hhYmxlIEV4Y2VwdGlvbigpJztcbiAgICAgICAgY29uc3QgZXJyb3IzID0gJ1VuY2F0Y2hhYmxlIEVycm9yKCkgLSBzaG91bGQgY3Jhc2ggdGhlIGFwcC4nO1xuXG4gICAgICAgICRsb2cubG9nKCdXaWxsLi4uLicgKyBlcnJvcjEpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RXJyb3IoZXJyb3IxKVxuICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgJGxvZy5sb2coJ0kgY2F0Y2hlZCBhbiBFcnJvci9FeGNlcHRpb246ICcgKyBlMSApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAkbG9nLmxvZygnV2lsbC4uLi4nICsgZXJyb3IyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93RXhjZXB0aW9uKGVycm9yMik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICRsb2cubG9nKCdJIGNhdGNoZWQgYW4gRXJyb3IvRXhjZXB0aW9uOiAnICsgZTIgKTtcbiAgICAgICAgICAgICAgICAkbG9nLmxvZygnV2lsbC4uLi4nICsgZXJyb3IzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93RXhjZXB0aW9uKGVycm9yMyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRocm93RXJyb3IgPSAodGV4dCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGV4dCk7XG4gICAgfTtcblxuICAgIHRocm93RXhjZXB0aW9uID0gKHRleHQpID0+IHtcbiAgICAgICAgdGhyb3cgdGV4dDtcbiAgICB9O1xuXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGFudG9pbmUgb24gOS8wMi8xNi5cbiAqL1xuXG5jbGFzcyBNYWluQ3RybCB7XG4gICAgY29uc3RydWN0b3IoJGxvZyl7XG5cbiAgICAgICAgJGxvZy5sb2coJ0kgYW0gYSBsb2cnLCAnd2l0aCB0d28gcGFyYW1ldGVycycpO1xuICAgICAgICAkbG9nLndhcm4oJ0kgYW0gYSB3YXJuJyk7XG4gICAgICAgICRsb2cuaW5mbygnSSBhbSBhbiBpbmZvJyk7XG4gICAgICAgIC8qJGxvZy5lcnJvcignSSBhbSBlcnJvciB3aXRoIGFuIG9iamVjdCcsIHtcbiAgICAgICAgICAgIG5hbWU6ICd2YWx1ZSdcbiAgICAgICAgfSk7Ki9cblxuXG4gICAgfVxuXG4gICAgdGl0bGUgPSAnQW5ndWxhciBFczYgcmV2aXNpdGVkJztcbn1cbmV4cG9ydCBkZWZhdWx0IE1haW5DdHJsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBhbnRvaW5lIG9uIDkvMDIvMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9kb0N0cmwge1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgY29uc29sZS5sb2coJ1RvZG9DdHJsIExvYWRlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFRvZG8gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh7dGV4dDp0aGlzLnRvZG9UZXh0LCBkb25lOmZhbHNlfSk7XG4gICAgICAgIHRoaXMudG9kb1RleHQgPSAnJztcbiAgICB9O1xuXG5cbiAgICB0aXRsZSA9IFwiVG9kb3MgdGl0bGVcIjtcblxuICAgIHRvZG9zID0gW1xuICAgICAgICB7dGV4dDonbGVhcm4gYW5ndWxhcicsIGRvbmU6dHJ1ZX0sXG4gICAgICAgIHt0ZXh0OididWlsZCBhbiBhbmd1bGFyIGFwcCcsIGRvbmU6ZmFsc2V9XTtcblxuICAgIHRvZG9UZXh0ID0gJyc7XG5cblxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgICAgIC8vc2NvcGU6IHsgcHJvZHVjdHM6IHsgZGF0YTogWyB7IG5hbWU6ICd0ZXN0JywgcHJpY2U6IDEgfV0gfSB9LFxuICAgICAgICB0ZW1wbGF0ZTogJzxsaSBuZy1yZXBlYXQ9XCJwcm9kdWN0IGluIHByb2R1Y3RzXCI+e3twcm9kdWN0Lm5hbWV9fSB7e3Byb2R1Y3QucHJpY2V9fTwvbGk+JyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9kdWN0cycpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYW50b2luZSBvbiA5LzAyLzE2LlxuICovXG5pbXBvcnQgTWFpbkN0cmwgZnJvbSAnLi9jb250cm9sbGVycy9NYWluJztcbmltcG9ydCBUb2RvQ3RybCBmcm9tICcuL2NvbnRyb2xsZXJzL1RvZG8nO1xuaW1wb3J0IEVycm9yQ3RybCBmcm9tICcuL2NvbnRyb2xsZXJzL0Vycm9yJztcblxuLy9pbXBvcnQge0luamVjdFNlcnZlcn0gZnJvbSAnLi4vYW5ndWxhci9zZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRzY2VQcm92aWRlcikge1xuXG5cbiAgICAkc2NlUHJvdmlkZXIuZW5hYmxlZChmYWxzZSk7XG5cbiAgICAkcm91dGVQcm92aWRlci53aGVuKCcvTWFpbicsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2R1Y3RzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBNYWluQ3RybCxcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nXG4gICAgfSk7XG5cbiAgICAkcm91dGVQcm92aWRlci53aGVuKCcvVG9kbycsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RvZG9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBUb2RvQ3RybCxcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nXG4gICAgfSk7XG5cbiAgICAkcm91dGVQcm92aWRlci53aGVuKCcvRXJyb3InLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9lcnJvci5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogRXJyb3JDdHJsLFxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcbiAgICB9KTtcblxuICAgICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSgnL01haW4nKTtcblxuXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG59OyJdfQ==
