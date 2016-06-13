'use strict';
module.factory('StringService', ['$http', 'URLS', function ($http, URLS) {
    return {
        getStrings: function () {
            return $http.get(URLS.model('strings'));
        }
    };
}]);
