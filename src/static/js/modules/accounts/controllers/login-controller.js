'use strict';
module.controller('LoginController', ['$scope', '$rootScope', '$cookies', 'AccountService', 'Event', function ($scope, $rootScope, $cookies, AccountService, Event) {

    function success(res) {
        AccountService.setAuthenticationToken(res).then(function () {
            window.location.href = '/';
        });
    }

    function error(res) {
        if (res.status === 400) {
            if (res.data && res.data.error && res.data.error.message == 'BAN') {
                $scope.status.ban = true;
            }
            else {
                $scope.status = {
                    invalid: true,
                    error: false
                };
            }
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
            window.location.hash = '#!/';
        }
    };

    $scope.login = function (form) {
        if (form.$valid) {
            $scope.status = {};
            $rootScope.$broadcast(Event.Load.Display, 'LOG_IN');
            AccountService.login($scope.model).then(function (res) {
                success(res.data);
            }).catch(function (res, code) {
                error(res);
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
        $scope.status = {};
        AccountService.login(creds).then(function (res) {
            success(res.data);
        }).catch(function (res) {
            error(res)
        });
    };

    $scope.facebookLoginClick = function () {
        FB.login(function (res) {
            checkLoginState(res);
        },
        function (res) {
            console.log(res);
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
