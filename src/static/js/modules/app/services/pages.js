'use strict';
module.factory('PageService', ['$http', 'URLS', function ($http, URLS) {

    return {
        getPartials: function (url) {
            console.log(url);
        }
    };
}]);
