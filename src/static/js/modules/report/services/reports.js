'use strict';
module.factory('ReportService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'reports';
    var cache = {};

    return {
        get: function (query) {
            var key = URLS.model(service).all + '?p=' + query.p + (query.q ? '&q=' + query.q : '');
            return $q(function (resolve, reject) {
                $http.get(key).then(function (res) {
                    cache[key] = res.data;
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        send: function (model) {
            var key = URLS.model(service).all;
            return $q(function (resolve, reject) {
                $http.post(key, model).then(function (res) {
                    cache[key] = res.data.data;
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        delete: function (model) {
            var key = URLS.model(service).one.replace('{id}', model.id);
            return $q(function (resolve, reject) {
                $http.delete(key).then(function (res) {
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        deleteImage: function (id) {
            var key = URLS.model(service).image_id.replace('{id}', id);
            return $q(function (resolve, reject) {
                $http.delete(key).then(function (res) {
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        recoverImage: function (id) {
            var key = URLS.model(service).image_id.replace('{id}', id);
            return $q(function (resolve, reject) {
                $http.patch(key).then(function (res) {
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        captcha: function () {
            return $q(function (resolve, reject) {
                $http.get(URLS.model(service).captcha).then(function (res) {
                    resolve(res.data)
                }).catch(reject);
            });
        }
        
    };
}]);