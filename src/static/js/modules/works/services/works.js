'use strict';
module.factory('WorkService', ['$rootScope', '$http', '$q', 'URLS', 'RepairService', 'ShopService', function ($rootScope, $http, $q, URLS, RepairService, ShopService) {

    var service = 'works';
    var cache = {};

    return {
        get: function (p, c) {
            var key = URLS.model(service).all + ('?p=' + p) + (c ? '&c=' + c : '');
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
                    ShopService.clearCache();
                    RepairService.clearCache();
                    resolve(res.data);
                }).catch(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    cache = {};
                    ShopService.clearCache();
                    RepairService.clearCache();
                    resolve(res.data.data);
                }).catch(reject);
            });
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).then(function (res) {
                    cache = {};
                    RepairService.clearCache();
                    resolve(res.data)
                }).catch(reject);
            });
        }
    };
}]);