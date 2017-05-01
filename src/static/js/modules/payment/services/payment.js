'use strict';
module.factory('PaymentService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'contacts';
    var cache = {};

    return {
        getAll: function (query) {
            var key = URLS.model(service).all + '?s=1'
                + (query.status ? '&status=' + query.status : '')
                + (query.month ? '&month=' + query.month : '')
                + (query.year ? '&year=' + (parseInt(query.year) - 543) : '');
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
                    resolve(res.data);
                }).catch(reject);
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
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
        captcha: function () {
            return $q(function (resolve, reject) {
                $http.get(URLS.model(service).captcha).then(function (res) {
                    resolve(res.data)
                }).catch(reject);
            });
        }
    };
}]);