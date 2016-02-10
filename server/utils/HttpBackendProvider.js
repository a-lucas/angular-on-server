export default function () {
    return {
        $get: function (serverRequestContext, $location) {
            var openReqs = 0;
            var doneCallbacks = [];
            var nextRequestId = 0;
            var pendingRequests = {};

            var startRequest = function () {
                openReqs++;
            };
            var endRequest = function () {
                openReqs--;
                if (openReqs < 1) {
                    openReqs = 0;
                    var toCall = doneCallbacks;
                    doneCallbacks = [];
                    for (var i = 0; i < toCall.length; i++) {
                        toCall[i]();
                    }
                }
            };

            // Register so we can know when our context is being disposed, so that we
            // can abort any outstanding requests.
            context.onDispose(
                function () {
                    for (var requestId in pendingRequests) {
                        var req = pendingRequests[requestId];
                        req.abort();
                        delete pendingRequests[requestId];
                    }
                }
            );

            var ret = function (
                reqMethod, reqUrl, reqData, callback, headers,
                timeout, withCredentials, responseType
            ) {
                var isJSONP = false;
                if (reqMethod.toLowerCase() === 'jsonp') {
                    // We don't want to run an arbitrary callback on the server, so instead
                    // we'll just strip off the callback invocation and the caller will get
                    // back whatever JSON is inside.
                    reqMethod = 'GET';
                    isJSONP = true;
                }
                startRequest();
                if (! serverRequestContext.hasRequest()) {
                    // we can't do HTTP requests yet, because we don't know our own URL.
                    console.error('Denied HTTP request', reqUrl, 'because we have no base URL');
                    callback(-1, undefined, undefined);
                    endRequest();
                }
                reqUrl = url.resolve($location.absUrl(), reqUrl);
                var urlParts = url.parse(reqUrl);

                var module;
                if (urlParts.protocol === 'http:') {
                    module = http;
                    if (! urlParts.port) {
                        urlParts.port = 80;
                    }
                }
                else if (urlParts.protocol === 'https:') {
                    module = https;
                    if (! urlParts.port) {
                        urlParts.port = 443;
                    }
                }
                else {
                    setTimeout(
                        function () {
                            // FIXME: Figure out what browsers do when an inappropriate
                            // protocol is specified and mimic that here.
                            callback(-1, undefined, undefined);
                            endRequest();
                        },
                        1
                    );
                    return;
                }

                var thisRequestId = nextRequestId;
                nextRequestId++;
                var req = pendingRequests[thisRequestId] = module.request(
                    {
                        hostname: urlParts.hostname,
                        port: urlParts.port,
                        path: urlParts.pathname +
                        (urlParts.search ? urlParts.search : ''),
                        method: reqMethod,
                        headers: {
                            'Host': urlParts.host
                        }
                    },
                    function (res) {
                        // ignore responses to aborted requests
                        if (! pendingRequests[thisRequestId]) {
                            return;
                        }

                        var status = res.statusCode;
                        // Angular's interface expects headers as a string,
                        // so we have to do a bit of an abstraction inversion here.
                        var headers = '';
                        for (var k in res.headers) {
                            headers += k + ': ' + res.headers[k] + '\n';
                        }
                        res.setEncoding('utf8'); // FIXME: what if it's not utf8?
                        var resData = [];
                        res.on(
                            'data',
                            function (chunk) {
                                // ignore responses to aborted requests
                                if (! pendingRequests[thisRequestId]) {
                                    return;
                                }
                                resData.push(chunk);
                            }
                        );
                        res.on(
                            'end',
                            function () {
                                // ignore responses to aborted requests
                                if (! pendingRequests[thisRequestId]) {
                                    return;
                                }
                                delete pendingRequests[thisRequestId];
                                var resStr = resData.join('');
                                if (isJSONP) {
                                    // Assume everything up to the opening paren is the callback name
                                    resStr = resStr.replace(/^[^(]+\(/, '')
                                        .replace(/\)\s*;?\s*$/, '');
                                }
                                // Call the callback before endRequest, to give the
                                // callback a chance to push more requests into the queue
                                // before we check if we're done.
                                callback(status, resStr, headers);
                                endRequest();
                            }
                        );
                    }
                );
                req.on(
                    'error',
                    function (err) {
                        // ignore responses to aborted requests
                        if (! pendingRequests[thisRequestId]) {
                            return;
                        }
                        delete pendingRequests[thisRequestId];
                        // FIXME: What is a good error response code for this case?
                        callback(-1, undefined, undefined);
                        endRequest();
                    }
                );
                if (reqData) {
                    req.write(reqData);
                }
                req.end();
            };

            // Extra interface to allow our server code to detect when
            // we're done loading things, so we know it's time to return
            // the response.
            ret.notifyWhenNoOpenRequests = function (cb) {
                // check for openReqs asynchronously to give any pending requests
                // a chance to begin.
                setTimeout(
                    function () {
                        if (openReqs > 0) {
                            doneCallbacks.push(cb);
                        }
                        else {
                            setTimeout(cb, 1);
                        }
                    },
                    1
                );
            };

            return ret;
        }
    };
}