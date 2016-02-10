import url from 'url';
import http from 'http';
import  https from 'https';
import ServerRequestContext from './ServerRequestContext';
import ServerFlattenPromisesProvider from './ServerFlattenPromisesProvider';
import LogProvider from './LogProvider';
import ExceptionHandler from './ExceptionHandler';
import HttpBackendProvider from './HttpBackendProvider';
import LocationProvider from './LocationProvider';
import NgView from './NgView';
import RouteProvider from './RouteProvider';
import SanitizeUrlProvider from './SanitizeUrlProvider';
import SceDelegateProvider from './SceDelegateProvider';
import EmptyProvider from './EmptyProvider';

/**
 *
 * @param window.angular
 * @param window.angular[myAppName]
 */
export default function ngOverride(angular, rootAngularModule) {

    // an app that depends on ngAnimate will fail on the absence of $rootElement in unbootstrapped
    // server context, and animation is not relevant on the server, so we just override it.
    angular.module('ngAnimate', []);
    module('ngAnimate', []);

    var module = rootAngularModule;

    // Timeout and interval don't really make sense in the server context, because we're always
    // trying to get stuff together as quickly as possible to return. Therefore we change the
    // meaning of setTimeout and setInterval to simply "execute once, asynchronously but as soon
    // as possible". This supports the case where timeouts are used to force code to run async,
    // but it doesn't support the case where a timeout is actually being used to implement a timeout
    // for a long-running operation, since of course then the operation will 'time out' immediately.
    (function () {
        var $injector = angular.injector(['ng']);
        var window = $injector.get('$window');
        var nextId = 1;
        // A map of pending ids to true if they are pending.
        // We intentionally avoid storing any references to the provided callback or to the
        // immediate object since this guarantees that only nodejs itself holds a reference to
        // the callback state and there's no risk of us leaking memory in here.
        var pending = {};

        var wrapCallback = function (id, cb) {
            return function () {
                if (pending[id]) {
                    delete pending[id];
                    cb.apply(this, arguments);
                }
            };
        };

        var enqueue = function (cb) {
            var id = nextId++;
            var wrappedCb = wrapCallback(id, cb);
            pending[id] = true;
            setImmediate(wrappedCb);
            return id;
        };

        var dequeue = function (id) {
            delete pending[id];
        };

        window.testFunction = function() {
            alert('I am a test');
        }

        window.setTimeout = function (cb) {
            return enqueue(cb);
        };
        window.setInterval = function (cb) {
            return enqueue(cb);
        };
        window.clearTimeout = function (id) {
            dequeue(id);
        };
        window.clearInterval = function (id) {
            dequeue(id);
        };

        // Register so we can know when our context is being disposed, so that we
        // can abort any outstanding requests.
        context.onDispose(
            function () {
                pending = {};
            }
        );

        // don't need these guys after we're done setting up.
        $injector = undefined;
        window = undefined;
    })();

    //module.factory( 'serverRequestContext', ServerRequestContext );

    //module.provider( 'serverFlattenPromises', ServerFlattenPromises );

    //module.provider( '$log', LogProvider );

    //module.provider( '$exceptionHandler',ExceptionHandler );

    //module.provider('$location',      LocationProvider    );

    //module.provider(        '$httpBackend',        HttpBackendProvider    );

    // $$SanitizeUri is actually a private service in AngularJS, so ideally we wouldn't touch it nor
    // depend on it at all, but this is a very common caller of Angular's internal "urlResolve" function
    // that ends up being particularly slow on jsdom, and so we override this service so we can use
    // a more efficient implementation in the server. What we really want to do here is override the
    // urlResolve function, but that's a local variable inside the AngularJS module and so we can't
    // get at it to override it.
    //module.provider(        '$$sanitizeUri',        SanitizeUrlProvider    );

    // The $sceDelegate service is another common caller of urlResolve, so we override this too.
    // For the moment we override it to be a no-op, but we might want to revisit this later to
    // ensure that we're sanitizing user-provided content on the server as well as the client.
    // For now we assume that there are fewer opportunities for injection on the server, since we
    // don't run inline scripts, we don't follow links, etc.
    //module.provider(        '$sceDelegate',        SceDelegateProvider    );

    // A reimplementation of $route that is largely the same as the standard $route but makes the
    // route introspection functions public.
    //module.provider('$route',RouteProvider);

    //module.provider('$routeParams', EmptyProvider);

    // this does basically the same thing as the one in ngRoute, but we're forced to provide this
    // here because we can't load ngRoute without its $route implementation obscuring our overridden
    // version.
    //module.directive( 'ngView', ngView );
}