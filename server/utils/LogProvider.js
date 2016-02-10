export default function () {
    return {
        $get: function (serverRequestContext) {

            function makeLogProxy(methodName) {
                return function () {
                    var logArgs = [
                        serverRequestContext.hasRequest() ?
                        '[' + serverRequestContext.location.absUrl() + ']' :
                            '[location not set]'
                    ].concat(Array.prototype.slice.call(arguments, 0));

                    console[methodName].apply(
                        console,
                        logArgs
                    );
                };
            }

            return {
                debug: makeLogProxy('log'),
                error: makeLogProxy('error'),
                info: makeLogProxy('info'),
                log: makeLogProxy('log'),
                warn: makeLogProxy('warn')
            };
        }
    };
}