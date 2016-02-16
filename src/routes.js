/**
 * Created by antoine on 9/02/16.
 */
import MainCtrl from './controllers/Main';
import TodoCtrl from './controllers/Todo';
import * as QProvider from './../angular/q';
import * as HttpBackendProvider from '../angular/httpBackend';
import { logProvider }  from '../angular/log';

export default function($routeProvider, $locationProvider, $sceProvider, $provide) {

    if ( typeof window.onServer === 'undefined') {
        console.log('ON CLIENT !!!');
    }

    if ( typeof window.onServer !== 'undefined') {
        console.log('ON SERVER !!!');

        $provide.decorator("$log", logProvider);

        $provide.provider("$q", QProvider.$QProvider);

        $provide.provider("$httpBackend", HttpBackendProvider.$HttpBackendProvider);

    }

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