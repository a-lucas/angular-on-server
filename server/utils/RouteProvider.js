export default function () {

    var routes = {};

    var baseRoute = {
        reloadOnSearch: true
    };

    this.when = function (path, route) {
        routes[path] = angular.extend(
            {},
            baseRoute,
            route,
            path && pathRegExp(path, route)
        );

        // create redirection for trailing slashes
        if (path) {
            var redirectPath = (path[path.length - 1] === '/') ?
                path.substr(0, path.length - 1) :
            path + '/';

            routes[redirectPath] = angular.extend(
                {redirectTo: path},
                baseRoute,
                pathRegExp(redirectPath, route)
            );
        }

        return this;
    };

    this.otherwise = function (params) {
        this.when(null, params);
        return this;
    };

    function pathRegExp(path, opts) {
        var insensitive = opts.caseInsensitiveMatch,
            ret = {
                originalPath: path,
                regexp: path
            },
            keys = ret.keys = [];

        path = path
            .replace(/([().])/g, '\\$1')
            .replace(
                /(\/)?:(\w+)([\?|\*])?/g,
                function (_, slash, key, option) {
                    var optional = option === '?' ? option : null;
                    var star = option === '*' ? option : null;
                    keys.push({ name: key, optional: !!optional });
                    slash = slash || '';
                    return '' +
                        (optional ? '' : slash) +
                        '(?:' +
                        (optional ? slash : '') +
                        (star && '(.+)?' || '([^/]+)?') + ')' +
                        (optional || '');
                })
            .replace(/([\/$\*])/g, '\\$1');

        ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
        return ret;
    }

    function inherit(parent, extra) {
        var extendee = angular.extend(
            function () {},
            {
                prototype: parent
            }
        );
        return angular.extend(
            new extendee(),
            extra
        );
    }

    this.$get = function (
        $rootScope,
        $location,
        $routeParams,
        $q,
        $injector,
        $http,
        $templateCache
    ) {

        var routeMethods = {
            jsonFriendly: function () {
                var route = this;
                var flattenPromises = $injector.get('serverFlattenPromises');
                var defer = $q.defer();

                route.populateLocals().then(
                    function (route) {
                        var locals = {};
                        var localServices = {};

                        // $template shows up based on the presence of 'template' or 'templateUrl'
                        // in the route, not based on route.resolve like the others we'll handle
                        // below.
                        if (route.locals.$template) {
                            locals.$template = route.locals.$template;
                        }

                        if (route.resolve) {
                            // We walk resolve rather than route.locals directly so that we can
                            // recognize which items were requests to inject a service and handle
                            // those as a special case.
                            for (var k in route.resolve) {
                                var resolver = route.resolve[k];
                                if (typeof resolver === 'string') {
                                    // they want to inject a service, but we can't serialize a service
                                    // as JSON so we just return the service names so the recipient of
                                    // this object can resolve them itself.
                                    localServices[k] = resolver;
                                }
                                else {
                                    locals[k] = route.locals[k];
                                }
                            }
                        }

                        // although route.resolve already resolved the top-level promises,
                        // we might need to do some more work if there are any promises nested
                        // inside the already-resolved objects; we have to completely resolve the
                        // whole structure before we can return the data as JSON.
                        flattenPromises(locals).then(
                            function (locals) {
                                defer.resolve(
                                    {
                                        path: route.originalPath,
                                        controller: route.controller,
                                        locals: locals,
                                        localServices: localServices,
                                        pathParams: route.pathParams
                                    }
                                );
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );
                    }
                );

                return defer.promise;
            },
            populateLocals: function () {
                var route = this;
                var $route = $injector.get('$route');

                var locals = {};

                // route resolve functions often depend on $route.current to get at
                // route parameters. In order to make that work in this context, where there isn't
                // really a "current route", we inject a special version of $route that has
                // $route.current overridden.
                // This should work for most apps, although an app that stashes this object somewhere
                // for later use outside of the resolve function could run into problems.
                var local$route = angular.extend(
                    {},
                    $route,
                    {
                        current: route
                    }
                );

                if (route.resolve) {
                    for (var k in route.resolve) {
                        var resolver = route.resolve[k];
                        if (typeof resolver === 'string') {
                            locals[k] = $injector.get(resolver);
                        }
                        else {
                            locals[k] = $injector.invoke(
                                resolver,
                                undefined,
                                {
                                    '$route': local$route
                                }
                            );
                        }
                    }
                }

                if (route.template !== undefined) {
                    locals.$template = route.template;
                }
                else if (route.templateUrl !== undefined) {
                    // For the moment we just fetch the template from our own server
                    // using an HTTP request, which ensures that the URL resolution will work
                    // how it would work in a browser. However, this is not especially efficient
                    // if the file happens to already be sitting on local disk, so we might
                    // want to do something better later. For now applications can circumvent
                    // this oddity by preloading the templates into the $templateCache.
                    var absTemplateUrl = url.resolve($location.absUrl(), route.templateUrl);
                    locals.$template = $http.get(
                        absTemplateUrl,
                        {
                            cache: $templateCache
                        }
                    ).then(
                        function (response) {
                            return response.data;
                        }
                    );
                }

                return $q.all(locals).then(
                    function (resolvedLocals) {
                        route.locals = resolvedLocals;
                        return route;
                    }
                );
            }
        };

        var $route = {};

        $route.routes = routes;

        function switchRouteMatcher(on, route) {
            var keys = route.keys;
            var params = {};

            if (!route.regexp) {
                return null;
            }

            var m = route.regexp.exec(on);
            if (!m) {
                return null;
            }

            for (var i = 1, len = m.length; i < len; ++i) {
                var key = keys[i - 1];

                var val = 'string' === typeof m[i] ?
                    decodeURIComponent(m[i]) :
                    m[i];

                if (key && val) {
                    params[key.name] = val;
                }
            }
            return params;
        }

        $route.getByPath = function (path, search) {
            var match = null;
            var params;
            search = search || {};

            angular.forEach(
                routes,
                function (route, routePath) {
                    if (! match) {
                        params = switchRouteMatcher(path, route);
                        if (params) {
                            match = inherit(
                                route,
                                {
                                    params: angular.extend(
                                        {},
                                        search,
                                        params
                                    ),
                                    pathParams: params
                                }
                            );
                            angular.extend(
                                match,
                                routeMethods
                            );
                            match.$$route = route;
                        }
                    }
                    else {
                        return;
                    }
                }
            );

            return match;
        };

        $route.getOtherwise = function () {
            var route = inherit(
                routes[null],
                {
                    params: {},
                    pathParams: {}
                }
            );
            angular.extend(
                route,
                routeMethods
            );
            return route;
        };

        return $route;

    };
}