'use strict';
module.factory('httpRequestInterceptor', ['$cookies', function ($cookies) {
    return {
        request: function (config) {
            var authorization = $cookies.get('Authorization');
            if (authorization) {
                config.headers['Authorization'] = authorization;
                config.timeout = 15000;
            }
            return config;
        }
    };
}]);