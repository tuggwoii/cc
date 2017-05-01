'use strict';
module.factory('WorkgroupService', ['$q', '$http', 'URLS', function ($q, $http, URLS) {

    var service = 'workgroup'
    var caches = {};

    return {
        get: function () {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).all;
                if (caches[key]) {
                    resolve(caches[key]);
                }
                else {
                    $http.get(key).then(function (res) {
                        caches[key] = res.data;
                        resolve(caches[key]);
                    }).catch(function (res) {
                        reject(res);
                    });
                }
            });
        },
        create: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all, model).then(function (res) {
                    caches = {};
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    caches = {};
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        delete: function (model) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', model.id), model).then(function (res) {
                    caches = {};
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        }
    };
}]);
