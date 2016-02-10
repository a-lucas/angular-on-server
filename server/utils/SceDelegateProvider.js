export default function () {
    this.$get = function () {
        var ret = {};

        ret.trustAs = function (type, value) {
            return value;
        };

        ret.valueOf = function (value) {
            return value;
        };

        ret.getTrusted = function (type, value) {
            return value;
        };

        return ret;
    };

    // these two are here just to satisfy the interface. We don't actually use them.
    this.resourceUrlWhitelist = function () {
        return ['self'];
    };
    this.resourceUrlBlacklist = function () {
        return [];
    };
}