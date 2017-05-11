'use strict';
module.factory('SettingsService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'settings';

    return {
        setAllCar: function (data) {
            var key = URLS.model(service).all;
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).all + '/cars', data)
                .then(function (res) {
                    resolve(res.data.data);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        update: function (model) {
            return $q(function (resolve, reject) {
                $http.patch(URLS.model(service).all, model).then(function (res) {
                    resolve(res.data.data);
                }).catch(reject);
            });
        },
        get: function () {
            return $q(function (resolve, reject) {
                $http.get(URLS.model(service).all).then(function (res) {
                    resolve(res.data.data);
                }).catch(reject);
            });
        }
    };
}]);