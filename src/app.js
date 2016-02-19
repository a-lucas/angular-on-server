import ErrorCtrl from './controllers/Error';
import MainCtrl  from './controllers/Main';
import TodoCtrl  from './controllers/Todo';
import Routes from './routes';

//import angular from 'angular';
//import ngResource from 'angular-resource';
//import ngRoute from 'angular-route';

import {AngularClient} from '../angular/client';
import ProductList from './directives/ProductList';

var moduleName='myApp';

window[moduleName] = angular
                        .module(moduleName, ['ngResource', 'ngRoute'])
                        .config(Routes)
                        .controller('MainCtrl', MainCtrl)
                        .controller('TodoCtrl', TodoCtrl)
                        .controller('ErrorCtrl', ErrorCtrl)
                        .directive('productList',ProductList);



if ( typeof window.onServer === 'undefined') {
    AngularClient(angular, document, 50000);
}
