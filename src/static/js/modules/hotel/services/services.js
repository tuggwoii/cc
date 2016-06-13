'use strict';
module.factory('HotelService', ['$http', '$q', 'URLS', function ($http, $q, URLS) {

    return {
        get: function (id) {
            return $http.get(URLS.model('hotels').one.replace('{id}', id));
        },
        getAll: function () {
            return $http.get(URLS.model('hotels').all);
        },
        create: function (data) {
            return $http.post(URLS.model('hotels').all, data);
        },
        delete: function (id) {
            return $http.delete(URLS.model('hotels').one.replace('{id}', id));
        }
    };
}]);
