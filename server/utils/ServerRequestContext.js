export default function ($injector) {
    var request;
    var requestUrlParts;
    var redirectTo;

    var ifRequest = function (code) {
        return function () {
            if (request) {
                return code();
            }
            else {
                throw new Error('location not available yet');
            }
        };
    };
    var parsedUrl = function (code) {
        return function (set, value) {
            if (request) {
                if (! requestUrlParts) {
                    requestUrlParts = url.parse(request.url, true);
                }
                return code(requestUrlParts, set, value);
            }
            else {
                throw new Error('location not available yet');
            }
        };
    };

    var absUrl = parsedUrl(
        function (parts) {
            // TODO: Make this be https: when the
            // request is SSL?
            return 'http://' +
                request.headers.host +
                parts.pathname +
                (parts.search ? parts.search : '');
        }
    );

    var reparseUrl = function () {
        requestUrlParts = url.parse(url.format(requestUrlParts), true);
    };

    return {
        location: {
            absUrl: absUrl,
            hash: function () {
                // the server never sees the fragment
                return '';
            },
            host: ifRequest(
                function () {
                    return request.headers.host;
                }
            ),
            path: parsedUrl(
                function (parts, set) {
                    if (set) {
                        var oldUrl = absUrl();
                        parts.pathname = set;
                        redirectTo = absUrl();
                        var $rootScope = $injector.get('$rootScope');
                        $rootScope.$broadcast(
                            '$locationChangeSuccess',
                            redirectTo,
                            oldUrl
                        );
                        requestUrlParts.pathname = set;
                        reparseUrl();
                        return this;
                    }
                    return parts.pathname;
                }
            ),
            port: ifRequest(
                function () {
                    // TODO: Make this actually check the port.
                    return 80;
                }
            ),
            protocol: ifRequest(
                function () {
                    // TODO: Make this be 'https' when the
                    // request is SSL?
                    return 'http';
                }
            ),
            search: parsedUrl(
                function (parts, set, paramValue) {
                    if (set) {
                        if (paramValue === null) {
                            delete parts.query[paramValue];
                        }
                        else if (paramValue) {
                            parts.query[set] = paramValue;
                        }
                        else {
                            parts.query = set;
                        }
                        var searchArgs = [];
                        for (var k in parts.query) {
                            searchArgs.push(k + '=' + parts.query[k]);
                        }
                        requestUrlParts.search = '?' + searchArgs.join('&');
                        reparseUrl();
                        return this;
                    }
                    return parts.query;
                }
            ),
            replace: function () {
                return this;
            },
            runningOnServer: true,
            url: parsedUrl(
                function (parts, set) {
                    if (set) {
                        requestUrlParts = url.parse(set, true);
                        reparseUrl();
                    }
                    return requestUrlParts.path;
                }
            )
        },
        setRequest: function (newRequest) {
            if (request) {
                throw new Error('This context already has a request');
            }
            else {
                request = newRequest;
            }
        },
        hasRequest: function () {
            return request ? true : false;
        },
        getRedirectTo: function () {
            return redirectTo;
        }
    };
}