var viewMod = angular.module('ngView', ['ngResource'], function($routeProvider, $locationProvider) {

  $routeProvider.when('/Catalog', {
    templateUrl: '/products.html',
    controller: 'ProductsCntl'
  });
  $routeProvider.when('/Catalog/:type', {
    templateUrl: '/products.html',
    controller: ProductTypeCntl
  });
  $routeProvider.when('/Todo', {
    templateUrl: '/todos.html',
    controller: TodoCtrl
  });

  $locationProvider.html5Mode(true);
});


/*****
 * Architecture
 *
 *  PARENT module ng-View with directive pre-rendered
 *
 *     <div prerendered></div>
 *
 *     to bootstrap the app - no multiple views
 *
 *
 */

/**********
 *
 * @param $scope
 * @param $route
 * @param $routeParams
 * @param $location
 * @param $http
 * @constructor
 */

function MainCntl($scope, $route, $routeParams, $location, $http) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.setLocation = function(url) {
    $scope.$location.path(url);
  }
}

function TodoCtrl($scope) {
  $scope.todos = [
    {text:'learn angular', done:true},
    {text:'build an angular app', done:false}];

  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };

  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
}

function ProductsCntl($scope, $routeParams, $resource) {
  $scope.$resource = $resource;
  $scope.name = "ProductsCntl";
  $scope.params = $routeParams;
}

function ProductTypeCntl($scope, $routeParams) {
  $scope.name = "ProductTypeCntl";
  $scope.params = $routeParams;
}

viewMod
viewMod.directive('productList', function($http) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    //scope: { products: { data: [ { name: 'test', price: 1 }] } },
    template: '<li ng-repeat="product in products">{{product.name}} {{product.price}}</li>',
    link: function(scope, element, attrs) {
       $http.get('/products').success(function(data) {
         console.log(data);
         scope.products = data;
      });
    }
  }
});