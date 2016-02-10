export default function () {
    return {
        $get: function (serverRequestContext) {
            return serverRequestContext.location;
        },
        html5Mode: function (mode) {
            // not actually relevant on the server, but we support this call anyway
            // so that client-oriented code can run unmodified on the server.
            return this;
        },
        hashPrefix: function (prefix) {
            // again, not relevant on the server.
            return this;
        }
    };
}