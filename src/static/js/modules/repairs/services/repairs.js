'use strict';
module.factory('RepairService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', 'ShareService', 'CarService', function ($rootScope, $http, $q, $cookies, URLS, ShareService, CarService) {

    var service = 'repairs';
    var cache = {};

    return {
        get: function (p, q) {
            var key = URLS.model(service).all
                + ('?p=' + p)
                + (q['car'] ? '&car=' + q['car'] : '')
                + (q['work'] ? '&work=' + q['work'] : '')
                + (q['title'] ? '&title=' + q['title'] : '')
                + (q['lp'] ? '&lp=' + q['lp'] : '')
                + (q['hp'] ? '&hp=' + q['hp'] : '')
                + (q['rating'] ? '&rating=' + q['rating'] : '')
                + (q['shop'] ? '&shop=' + q['shop'] : '')
                + (q['limit'] ? '&limit=' + q['limit'] : '');
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
        getByShop: function (p, q) {
            var key = URLS.model(service).all + '/shop'
                + ('?p=' + p)
                + (q['shop'] ? '&shop=' + q['shop'] : '')
                + (q['limit'] ? '&limit=' + q['limit'] : '');
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
        create: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all, model).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res);
                }).error(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res.data);
                }).error(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res)
                }).error(reject);
            });
        },
        getPreviousShop: function (carId) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).shops + '?car=' + carId;
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        cache[key] = res;
                        resolve(res)
                    }).error(reject);
                }
            });
        },
        uploadImage: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).image, model).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    CarService.removeCache();
                    resolve(res)
                }).error(reject);
            });
        },
        deleteImage: function (model) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).image_id.replace('{id}', model.id)).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    CarService.removeCache();
                    resolve(res)
                }).error(reject);
            });
        },
        saveImage: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).image, model).success(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res)
                }).error(reject);
            });
        },
        clearCache: function () {
            cache = {};
        }
    };
}]);