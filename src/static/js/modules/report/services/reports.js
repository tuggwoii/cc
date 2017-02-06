'use strict';
module.factory('ReportService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'reports';
    var cache = {};

    return {
        get: function (p, q) {
            var key = URLS.model(service).all;
            return $q(function (resolve, reject) {
                $http.get(key).success(function (res) {
                    cache[key] = res;
                    resolve(res);
                }).error(function (res) {
                    reject(res);
                });
            });
        },
        send: function (model) {
            var key = URLS.model(service).all;
            return $q(function (resolve, reject) {
                $http.post(key, model).success(function (res) {
                    cache[key] = res.data;
                    resolve(res.data);
                }).error(function (res) {
                    reject(res);
                });
            });
        },

    };
}]);