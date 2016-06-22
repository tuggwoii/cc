'use strict';
module.factory('AccountService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', function ($rootScope, $http, $q, $cookies, URLS) {

    var userAuthenticationCallback;

    function me () {
        return $http.get(URLS.model('accounts').me);
    }

    function login (model) {
        return $http.post(URLS.model('accounts').login, model);
    }

    function initUserAunthentication () {
        if ($cookies.get('Authorization')) {
            me().success(function (res) {
                window.cheepow.user = res.data;
                $rootScope.$broadcast('UPDATE_USER');
            }).error(function () {
                $cookies.remove('Authorization');
                checkFacebookLoginState();
            }).finally(function () {
                doneCheckAuthentication();
            });
        }
        else {
            checkFacebookLoginState();
        }
    }

    function notLoginState () {
        window.cheepow.user = {};
    }

    function doneCheckAuthentication () {
        userAuthenticationCallback();
    }

    function noFacebokLogin() {
        notLoginState();
        doneCheckAuthentication();
    }

    function checkFacebookLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response, facebookLogin, noFacebokLogin);
        });
        notLoginState ();
        doneCheckAuthentication();
    }

    function facebookLogin(creds) {
        login(creds).success(function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.cheepow.user = res.data;
        }).error(function () {
            notLoginState();
        }).finally(function () {
            doneCheckAuthentication();
        });
    }

    return {
        login: function (model) {
            return login(model);
        },
        register: function (model) {
            return $http.post(URLS.model('accounts').register, model);
        },
        me: function () {
            return me();
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
        },
        initializeUserOnLoad: function () {
            return $q(function (resolve, reject) {
                userAuthenticationCallback = resolve;
                initUserAunthentication();
            });
        }
    };
}]);
