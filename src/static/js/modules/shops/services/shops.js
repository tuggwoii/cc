'use strict';
module.factory('ShopService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', 'RepairService', function ($rootScope, $http, $q, $cookies, URLS, RepairService) {

    var service = 'shops';
    var cache = {};

    return { 
        get: function (page, limits, query_text, services, province, rating, using_count) {

            var key = URLS.model(service).all
                + ('?p=' + page)
                + (limits ? '&limits=' + limits : '')
                + (query_text ? '&q=' + query_text : '')
                + (services ? '&s=' + services : '')
                + (province ? '&c=' + province : '')
                + (rating ? '&r=' + rating : '')
                + (using_count ? '&using_count='+ using_count : '');

            return $q(function (resolve, reject) {
                $http.get(key).then(function (res) {
                    cache[key] = res.data;
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res);
                });
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
                    resolve(res.data);
                }).catch(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    cache = {};
                    RepairService.clearCache();
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
        search: function (q, province) {
            var key = URLS.model(service).all + '?limits=20' + ('&q=' + q) + (province ? '&c=' + province : '');
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
        clearCache: function () {
            cache = {};
        }
    };
}]);