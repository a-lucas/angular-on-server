/**
 * Created by antoine on 9/02/16.
 */
import MainCtrl from './controllers/Main';
import TodoCtrl from './controllers/Todo';
import PromiseProvider from '../server/utils/ServerFlattenPromisesProvider'

export default function($routeProvider, $locationProvider, $sceProvider, $provide) {

    if ( typeof window.onServer === 'undefined') {
        console.log('ON CLIENT !!!');
    }

    if ( typeof window.onServer !== 'undefined') {
        console.log('ON SERVER !!!');

        $provide.decorator("$log", function ($delegate) {

            return {

                log: function () {
                    console.log('LOG!!');
                    $delegate.log(arguments);
                },

                info: function () {
                    $delegate.info(arguments);
                },

                error: function () {
                    $delegate.error(arguments);
                },

                warn: function () {
                    $delegate.warn(arguments);
                }
            };

        });

        //$provide.decorator('$q', PromiseProvider);

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