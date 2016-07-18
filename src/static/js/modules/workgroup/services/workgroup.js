'use strict';
module.factory('WorkgroupService', ['$q', '$http', 'URLS', function ($q, $http, URLS) {

    var service = 'workgroup'
    var cache;

    return {
        get: function () {
            return $q(function (resolve, reject) {
                if (cache) {
                    return $q(function (resolve) {
                        resolve(cache);
                    });
                }
                else {
                    $http.get(URLS.model(service).all).success(function (res) {
                        cache = res.data;
                        resolve(res.data);
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
        }
    };
}]);
