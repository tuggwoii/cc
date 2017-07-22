'use strict';
module.factory('ProblemService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'problems';

    return {
        sendReport: function (data) {
            var key = URLS.model(service).all;
             
            return $q(function (resolve, reject) {
                $http.post(key, data).then(function (res) {
                    resolve(res.data);
                }).catch(function (res) {
                    reject(res.data);
                });
            });
        },
        captcha: function () {
            return $q(function (resolve, reject) {
                $http.get(URLS.model(service).captcha).then(function (res) {
                    resolve(res.data)
                }).catch(function (res) {
                    reject(res.data);
                });
            });
        }
    };
}]);