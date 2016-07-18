'use strict';
module.factory('AccountService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', 'Event', function ($rootScope, $http, $q, $cookies, URLS, Event) {

    var service = 'accounts';
    var userAuthenticationCallback;

    function me () {
        return $http.get(URLS.model(service).me);
    }

    function login (model) {
        return $http.post(URLS.model(service).login, model);
    }

    function initUserAuthentication() {
        if ($cookies.get('Authorization')) {
            me().success(function (res) {
                window.carcare.user = res.data;
                $rootScope.$broadcast(Event.User.Update);
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
        window.carcare.user = {};
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
        notLoginState();
        doneCheckAuthentication();
    }

    function facebookLogin(creds) {
        login(creds).success(function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.carcare.user = res.data;
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
            return $http.post(URLS.model(service).register, model);
        },
        me: function () {
            return me();
        },
        update: function (model) {
            return $http.patch(URLS.model(service).update, model);
        },
        logout: function () {
            return $q(function (resolve, reject) {
                $http.post(URLS.model(service).logout).success(resolve).error(reject);
            });
        },
        setAuthenticationToken: function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.carcare.user = res.data;
            $rootScope.$broadcast(Event.User.Update);
        },
        initializeUserOnLoad: function () {
            return $q(function (resolve, reject) {
                userAuthenticationCallback = resolve;
                initUserAuthentication();
            });
        }
    };
}]);
