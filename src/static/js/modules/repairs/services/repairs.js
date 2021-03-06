﻿'use strict';
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
                    $http.get(key).then(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).catch(function (res) {
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
            return $q(function (resolve, reject) {
                var key = URLS.model(service).one.replace('{id}', id);
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).then(function (res) {
                        cache[key] = res.data.data;
                        resolve(res.data.data);
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
                    ShareService.clearCache();
                    resolve(res.data);
                }).catch(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res.data.data);
                }).catch(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).then(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res.data)
                }).catch(reject);
            });
        },
        getPreviousShop: function (carId) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).shops + '?car=' + carId;
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).then(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).catch(reject);
                }
            });
        },
        uploadImage: function (model) {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).image, model).then(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    CarService.removeCache();
                    resolve(res.data)
                }).catch(reject);
            });
        },
        deleteImage: function (model) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).image_id.replace('{id}', model.id)).then(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    CarService.removeCache();
                    resolve(res.data)
                }).catch(reject);
            });
        },
        saveImage: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).image, model).then(function (res) {
                    cache = {};
                    ShareService.clearCache();
                    resolve(res.data)
                }).catch(reject);
            });
        },
        clearCache: function () {
            cache = {};
        },
        getAdmin: function (p, q) {
            var key = URLS.model(service).admin_all
                + ('?p=' + p)
                + (q['q'] ? '&q=' + q['q'] : '')
                + ('&limits=' + q['limits'])
                + (q['work'] ? '&work=' + q['work'] : '')
                + (q['province'] ? '&province=' + q['province'] : '')
                + (q['months'] ? '&months=' + q['months'] : '')
                + (q['year'] ? '&year=' + q['year'] : '')
                + (q['lp'] ? '&lp=' + q['lp'] : '')
                + (q['hp'] ? '&hp=' + q['hp'] : '')
                + (q['rating'] ? '&rating=' + q['rating'] : '')
                + (q['hasimage'] ? '&hasimage=' + q['hasimage'] : '')
                + (q['sort_column'] ? '&sort_column=' + q['sort_column'] : '')
                + (q['sort_order'] ? '&sort_order=' + q['sort_order'] : '')
                ;
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    //resolve(cache[key]);
                }
                //else {
                $http.get(key).then(function (res) {
                    cache[key] = res.data;
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
                //}
            });
        }
    };
}]);