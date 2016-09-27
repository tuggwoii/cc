'use strict';
module.factory('PageService', ['$q', '$http', 'URLS', function ($q, $http, URLS) {

    var service = 'pages';
    var cache = {};

    return {
        getAll: function () {
            var key = URLS.model(service).all;
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(URLS.model(service).all).success(function (res) {
                        cache[key] = res;
                        resolve(res);
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
        }
    };
}]);
