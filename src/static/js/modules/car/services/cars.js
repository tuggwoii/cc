'use strict';
module.factory('CarService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {

    var service = 'cars';
    var car;
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
        getById: function (id) {
            if (car && car.id == id) {
                return $q(function (resolve) {
                    resolve(car);
                });
            }
            else {
                return $q(function (resolve, reject) {
                    $http.get(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                        resolve(res.data);
                    }).error(function (res) {
                        reject(res);
                    });
                });
            }
        },
        create: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all, model).success(function (res) {
                    cache = undefined;
                    resolve(res);
                }).error(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).success(function (res) {
                    cache = undefined;
                    car = undefined;
                    resolve(res.data);
                }).error(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                    cache = undefined;
                    car = undefined;
                    resolve(res)
                }).error(reject);
            });
        },
        saveCurrent: function (_car) {
            car = _car;
        },
        getCurrent: function () {
            return car;
        }
    };
}]);