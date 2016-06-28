'use strict';
module.factory('CarService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {

    var service = 'cars';
    var cache;

    return {
        get: function (model) {
            if (cache) {
                return $q(function (resolve) {
                    resolve(cache);
                });
            }
            else {
                return $q(function (resolve, reject) {
                    $http.get(URLS.model(service).all).success(function (res) {
                        cache = res;
                        resolve(res);
                    }).error(function (res) {
                        reject(res);
                    });
                });
            }
        },
        create: function (model) {
            return $http.post(URLS.model(service).all, model);
        }
    };
}]);