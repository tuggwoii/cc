'use strict';
module.factory('CarService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {

    var service = 'cars';
    var cache = {};

    return {
        get: function (query) {
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
        },
        getAll: function (query) {
            console.log(query);
            var key = URLS.model(service).admin_all
                + '?p=' + query.p
                + (query.q ? '&q=' + query.q : '')
                + (query.order ? '&order=' + query.order : '');
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        cache[key] = res;
                        resolve(res);
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
        },
        getById: function (id) {
            var key = URLS.model(service).one.replace('{id}', id);
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    resolve(angular.copy(cache[key]));
                }
                else {
                    $http.get(key).success(function (res) {
                        resolve(res.data);
                        cache[key] = res.data;
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
            
        },
        getByIds: function (ids) {
            var key = URLS.model(service).one.replace('/{id}','') + '_ids?ids=' + ids;
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    resolve(angular.copy(cache[key]));
                }
                else {
                    $http.get(key).success(function (res) {
                        resolve(res.data);
                        cache[key] = res.data;
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });

        },
        create: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all, model).success(function (res) {
                    cache = {};
                    resolve(res);
                }).error(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).success(function (res) {
                    cache = {};
                    resolve(res.data);
                }).error(reject);
            });
        },
        updateAdmin: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).admin_all, model).success(function (res) {
                    cache = {};
                    resolve(res.data);
                }).error(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                    cache = {};
                    resolve(res)
                }).error(reject);
            });
        },
        removeCache: function () {
            cache = {};
        }
    };
}]);