'use strict';
module.factory('NotificationService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', 'CarService', 'RepairService', function ($rootScope, $http, $q, $cookies, URLS, CarService, RepairService) {

    var service = 'notifications';
    var cache = {};

    return {
        get: function (page, type, car, limit) {
            var key = URLS.model(service).all + ('?p=' + page) + (type ? '&t=' + type : '') + (car ? '&c=' + car : '') + (limit ? '&limit=' + limit : '');
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
            return $q(function (resolve, reject) {
                var key = URLS.model(service).one.replace('{id}', id);
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
        },
        getByType: function (type) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).all +'/type/' + type;
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
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
                    CarService.removeCache();
                    RepairService.clearCache();
                    resolve(res);
                }).error(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).success(function (res) {
                    cache = {};
                    CarService.removeCache();
                    RepairService.clearCache();
                    resolve(res.data);
                }).error(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                    cache = {};
                    CarService.removeCache();
                    RepairService.clearCache();
                    resolve(res)
                }).error(reject);
            });
        }
    };
}]);