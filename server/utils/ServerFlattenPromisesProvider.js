export default function ServerFlatenPromises() {
    return {
        $get: function ($q) {

            return {
                $get: function (obj) {
                    console.log('instanciating a serverflattenplromise: ', obj);

                    var defer = $q.defer();

                    var outstandingPromises = 0;

                    var maybeDone = function () {
                        if (outstandingPromises === 0) {
                            console.log('Maybe Done: ', obj);
                            defer.resolve(obj);
                        }
                    };

                    var flattenKey = function (obj, k, v) {
                        if (v && typeof v.then === 'function') {
                            outstandingPromises++;
                            v.then(
                                function (nextV) {
                                    outstandingPromises--;
                                    flattenKey(obj, k, nextV);
                                }
                            );
                        }
                        else {
                            obj[k] = v;
                            if (typeof v === 'object') {
                                flattenObj(v);
                            }
                            maybeDone();
                        }
                    };

                    var flattenObj = function (obj) {
                        console.log('flattening obj: ', obj);
                        for (var k in obj) {
                            flattenKey(obj, k, obj[k]);
                        }
                    };

                    flattenObj(obj);

                    maybeDone();

                    return defer.promise;
                }
            };
        }
    };
}