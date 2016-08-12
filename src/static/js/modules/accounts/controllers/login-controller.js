﻿'use strict';
module.controller('LoginController', ['$scope', '$rootScope', '$cookies', 'AccountService', 'Event', function ($scope, $rootScope, $cookies, AccountService, Event) {

    function success(res) {
        AccountService.setAuthenticationToken(res).then(function () {
            window.location.href = '/';
        });
    }

    function error (res, code) {
        if (code === 400) {
            $scope.status = {
                invalid: true,
                error: false
            };
        }
        else {
            $scope.status = {
                invalid: false,
                error: true
            };
        }
        $rootScope.$broadcast(Event.Load.Dismiss, 'LOG_IN');
    }

    $scope.init = function () {
        if (!$scope.user || !$scope.user.id) {
            $scope.model = {};
            $scope.status = {
                invalid: false,
                error: false
            };
        }
        else {
            window.location.hash = '#/';
        }
    };

    $scope.login = function (form) {
        if (form.$valid) {
            $rootScope.$broadcast(Event.Load.Display, 'LOG_IN');
            AccountService.login($scope.model).success(function (res) {
                success(res);
            }).error(function (res, code) {
                error(res, code);
            });
        }
    };

    $scope.keyPress = function (form, event) {
        if (event.keyCode === 13) {
            $scope.login(form);
        }
    }

    $scope.facebookLogin = function (creds) {
        $rootScope.$broadcast(Event.Load.Display);
        AccountService.login(creds).success(function (res) {
            success(res);
        }).error(function (res) {
            error(res, 500)
        });
    };

    $scope.init();

}]);

function facebookLogin (creds) {
    angular.element(document.getElementById('loginForm')).scope().facebookLogin(creds);
}

function checkLoginState () {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response, facebookLogin);
    });
}
