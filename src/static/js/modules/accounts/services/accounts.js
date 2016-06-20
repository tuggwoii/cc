'use strict';
module.factory('AccountService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {
	return {
        login: function (model) {
            return $http.post(URLS.model('accounts').login, model);
        },
        register: function (model) {
            return $http.post(URLS.model('accounts').register, model);
        },
        me: function () {
            return $http.get(URLS.model('accounts').me);
        },
        update: function (model) {
            return $http.patch(URLS.model('accounts').update, model);
        },
        logout: function () {
            return $q(function (resolve, reject) {
                FB.getLoginStatus(function (crets) {
                    if (crets.authResponse) {
                        FB.logout(function (response) {
                            $http.post(URLS.model('accounts').logout).success(resolve).error(reject);
                        });
                    } else {
                        $http.post(URLS.model('accounts').logout).success(resolve).error(reject);
                    }
                });
            });
        },
        setAuthenticationToken: function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.cheepow.user = res.data;
            $rootScope.$broadcast('UPDATE_USER');
        }
    };
}]);
