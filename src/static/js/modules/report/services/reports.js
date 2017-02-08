'use strict';
module.factory('ReportService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'reports';
    var cache = {};

    return {
        get: function (query) {
            var key = URLS.model(service).all + '?p=' + query.p + (query.q ? '&q=' + query.q : '');
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
        delete: function (model) {
            var key = URLS.model(service).one.replace('{id}', model.id);
            return $q(function (resolve, reject) {
                $http.delete(key).success(function (res) {
                    resolve(res.data);
                }).error(function (res) {
                    reject(res);
                });
            });
        },
        deleteImage: function (id) {
            var key = URLS.model(service).image_id.replace('{id}', id);
            return $q(function (resolve, reject) {
                $http.delete(key).success(function (res) {
                    resolve(res.data);
                }).error(function (res) {
                    reject(res);
                });
            });
        }
    };
}]);