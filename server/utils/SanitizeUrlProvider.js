export default function () {
    var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/;
    var imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;

    var ret = {};

    ret.aHrefSanitizationWhitelist = function (regexp) {
        if (angular.isDefined(regexp)) {
            aHrefSanitizationWhitelist = regexp;
            return this;
        }
        return aHrefSanitizationWhitelist;
    };

    ret.imgSrcSanitizationWhitelist = function (regexp) {
        if (angular.isDefined(regexp)) {
            imgSrcSanitizationWhitelist = regexp;
            return this;
        }
        return imgSrcSanitizationWhitelist;
    };

    ret.$get = function (serverRequestContext) {
        return function sanitizeUri(uri, isImage) {
            var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;

            // if we don't know our base URL yet then we can't sanitize, so
            // just skip. This generally applies only to a context created outside of
            // a request, e.g. for server configuration, so malicious links here are
            // pretty harmless anyway since we're not a browser and there's no user
            // around to click on them.
            if (! serverRequestContext.hasRequest()) {
                return uri;
            }

            var baseUrl = serverRequestContext.location.absUrl();

            // mimic the behavior of UrlResolve
            var normalizedVal;
            if (uri === null) {
                normalizedVal = url.resolve(baseUrl, '/null');
            }
            else {
                normalizedVal = url.resolve(baseUrl, uri);
            }

            if (normalizedVal !== '' && !normalizedVal.match(regex)) {
                return 'unsafe:' + normalizedVal;
            }
            else {
                return uri;
            }
        };
    };

    return ret;
}