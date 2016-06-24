'use strict';
module.factory('CarService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {

    var service = 'cars';
    return {
        get: function (model) {
            return $http.get(URLS.model(service).all);
        }
    };
}]);