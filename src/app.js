
import MainCtrl  from './controllers/Main';
import TodoCtrl  from './controllers/Todo';
import Routes from './routes';
import angular from 'angular';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';

import ProductList from './directives/ProductList';

//angular.module('ngView', ['ngResource']).directive('prerendered', PreRender)

var moduleName='myApp';



window[moduleName] = angular
                        .module(moduleName, ['ngResource', 'ngRoute'])
                        .config(Routes)
                        .controller('MainCtrl', MainCtrl)
                        .directive('productList',ProductList)
                        .controller('TodoCtrl', TodoCtrl);

if ( typeof window.onServer === 'undefined') {
    console.log(window);
    console.log('I am on the client !!!');

    // Remove all the scopes


    // Remove the styles
    var x = document.head.getElementsByTagName("style");
    for (var i = x.length - 1; i >= 0; i--) {
        x[i].parentElement.removeChild(x[i]);
    }
    // empty the prerender div
    var view = document.getElementById('prerendered');
    if (view) {
        view.innerHTML = '';
    }
    else {
        var view = '<div id="prerendered"></div>';
        document.body.appendChild(view);
    }

    var html = angular.element(document.getElementById('myApp'));

    console.log('angular', angular);

    console.log('html = ', html);
    angular.bootstrap(html, ['myApp']);

} else {
    console.log('I am on th server');
}


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