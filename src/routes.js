/**
 * Created by antoine on 9/02/16.
 */
import MainCtrl from './controllers/Main';
import TodoCtrl from './controllers/Todo';
import Q from 'q';


export default function($routeProvider, $locationProvider, $sceProvider, $provide) {

    if ( typeof window.onServer === 'undefined') {
        console.log('ON CLIENT !!!');
    }

    if ( typeof window.onServer === 'undefined') {
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


        var myPromise = function() {

            /***
             * This is a buggy implementation
             * @type {{id: number, generate: uuid.generate}}
             */
            var uuid = {
                id: 0,
                generate: function() {
                    this.id++;
                    return this.id;
                }
            }


            var Queue = {
                promiseResults: [],
                promises: [],
                status: 0, //0 inactive, 1 : procesing
                addPromiseResult: function(uid, result, onFulfilled, onRejected, progressBack) {
                    if (!this.promises[uid]) throw ('Promise uid missing');
                    if (this.promiseResults[uid]) throw ('Promise uid exists');
                    this.promiseResults[uid] = [result, onFulfilled, onRejected, progressBack];
                },
                addPromise: function(p) {
                    if (!p.uid) throw 'PRomisep doesnt have a uid';
                    this.promises[p.uid] = p;
                },
                processQueue: function() {
                    if ( this.status === 1 || this.promiseResults.length === 0 ) return;
                    this.status = 1;
                    for (var i in this.promiseResults) {
                        this.promises[uid] = undefined;
                        delete this.promises[uid];
                    }
                }
            }


            var Deferred = function() {
                var promise = new Promise();
                promise.prototype.uuid = uuid.generate();
                console.log("promise created", promise);
                return promise;
            }

            var $Q = function Q(resolver) {

                console.log('Promise myPromise created with ', resolver);

                if (!isFunction(resolver)) {
                    throw $qMinErr('norslvr', "Expected resolverFn, got '{0}'", resolver);
                }

                var deferred = new Deferred();

                function resolveFn(value) {
                    deferred.resolve(value);
                }

                function rejectFn(reason) {
                    deferred.reject(reason);
                }

                resolver(resolveFn, rejectFn);

                return deferred.promise;
            };


            $Q.prototype = Promise.prototype;

            console.log('mypromise body: ', this);

            var defer = function() {
                console.log('defer');
            };

            var when = function(value, callback, errback, progressBack) {
                console.log('when called with', value, callback, errback, progressBack);


                var result = new Deferred();
                result.resolve(value);
                return result.promise.then(uuid, callback, errback, progressBack);
            };

            var then = function(uuid, onFulfilled, onRejected, progressBack) {
                if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
                    return this;
                }

                Queue.addPromiseResult( uuid, onFulfilled, onRejected, progressBack );
                Queue.processQueue();
            }


            function resolve() {
                console.log('resolve')
            }

            function reject() {
                console.log('resolve')
            }


            function all() {
                console.log('all');
            }

            $Q.defer = defer;
            $Q.reject = reject;
            $Q.when = when;
            $Q.resolve = resolve;
            $Q.all = all;


            return $Q;

        }



        $provide.decorator("$q", function($delegate) {

            return myPromise(function(callback) {
                $rootScope.$evalAsync(callback);
            }, function(err) {
                console.log(err);
                throw err;
            });
        })



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