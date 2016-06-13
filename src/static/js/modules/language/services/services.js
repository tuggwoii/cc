'use strict';
module.factory('LanguageService', ['$http', '$q', 'URLS', function ($http, $q, URLS) {

    return {
        getAll: function () {
            return $http.get(URLS.model('languages').all);
        },
        create: function (data) {
            return $http.post(URLS.model('languages').all, data);
        },
        delete: function (id) {
            return $http.delete(URLS.model('languages').one.replace('{id}', id));
        }
    };
}]);
