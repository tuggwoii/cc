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
                    $http.get(URLS.model(service).all).then(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).catch(function (res) {
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
                    $http.get(key).then(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).catch(function (res) {
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
                    $http.get(key).then(function (res) {
                        resolve(res.data.data);
                        cache[key] = res.data.data;
                    }).catch(function (res) {
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
                    $http.get(key).then(function (res) {
                        resolve(res.data.data);
                        cache[key] = res.data.data;
                    }).catch(function (res) {
                        reject(res);
                    });
                }
            });

        },
        create: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all, model).then(function (res) {
                    cache = {};
                    resolve(res.data);
                }).catch(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    cache = {};
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res.data);
                });
            });
        },
        updateAdmin: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).admin_all, model).then(function (res) {
                    cache = {};
                    resolve(res.data.data);
                }).catch(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).then(function (res) {
                    cache = {};
                    resolve(res.data)
                }).catch(reject);
            });
        },
        removeCache: function () {
            cache = {};
        }
    };
}]);