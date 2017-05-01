'use strict';
module.factory('PageService', ['$q', '$http', 'URLS', function ($q, $http, URLS) {

    var service = 'pages';
    var cache = {};

    return {
        getAll: function () {
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
        }
    };
}]);
