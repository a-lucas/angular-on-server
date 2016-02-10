/**
 * Created by antoine on 9/02/16.
 */
import MainCtrl from './controllers/Main';
import TodoCtrl from './controllers/Todo';

export default function($routeProvider, $locationProvider, $sceProvider) {

    $sceProvider.enabled(false);

    $routeProvider.when('/Main', {
        templateUrl: './views/products.html',
        controller: MainCtrl,
        controllerAs: 'vm'
    });

    $routeProvider.when('/Todo', {
        templateUrl: './views/todos.html',
        controller: TodoCtrl,
        controllerAs: 'vm'
    });

    $routeProvider.otherwise('/Main');


    $locationProvider.html5Mode(true);

};