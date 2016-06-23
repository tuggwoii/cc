'use strict';
module.controller('LoginController', ['$scope', '$rootScope', '$cookies', 'AccountService', function ($scope, $rootScope, $cookies, AccountService) {

    function success(res) {
        AccountService.setAuthenticationToken(res);
        $scope.navigateTo('#/');
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
        FB.XFBML.parse();
    };

    $scope.login = function (form) {
        if (form.$valid) {
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
