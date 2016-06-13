'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', 'AccountService', function ($scope, $rootScope, $timeout, $cookies, AccountService) {

    function userAuth () {
        if ($cookies.get('Authorization')) {
            console.log('1');
            AccountService.me().success(function (res) {
                console.log('2');
                window.cheepow.user = res.data;
                $scope.user = window.cheepow.user;
            }).error(function () {
                $cookies.remove('Authorization');
                checkFacebookLoginState();
                console.log('3');
            }).finally(function () {
                doneCheckAuth();
            });
        }
        else {
            console.log('4');
            checkFacebookLoginState();
        }
    }

    function notLogin () {
        window.cheepow.user = {};
        $scope.user = {};
    }

    function doneCheckAuth () {
        $rootScope.$broadcast('USER_LOADED');
    }

    function noFacebokLogin () {
        notLogin();
        doneCheckAuth();
    }

    function checkFacebookLoginState () {
        FB.getLoginStatus(function (response) {
            console.log('5');
            statusChangeCallback(response, facebookLogin, noFacebokLogin);
        });
        notLogin();
        doneCheckAuth();
    }

    function facebookLogin (creds) {
        AccountService.login(creds).success(function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.cheepow.user = res.data;
            $scope.user = window.cheepow.user;
            console.log($scope.user);
        }).error(function () {
            console.log('6');
            notLogin();
        }).finally(function () {
            doneCheckAuth();
        });
    }

    $scope.init = function () {
        $scope.screenTransition = 'fadeIn';
        $scope.screenReady = true;
        userAuth();
    };

    $scope.navigateTo = function (url) {
        if (url !== window.location.hash) {
            $scope.screenTransition = 'fadeOut';
            $timeout(function () {
                $scope.screenReady = false;
                $scope.screenTransition = 'fadeIn';
            }, 200);
            $timeout(function () {
                window.location.hash = url;
                $scope.screenReady = true;
            }, 500);
        }
    };

    $scope.$on('UPDATE_USER', function () {
        $scope.user = window.cheepow.user;
    });

    $scope.init();

}]);
