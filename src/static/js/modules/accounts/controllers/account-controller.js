'use strict';
module.controller('AccountController', ['$scope', '$rootScope', '$timeout', '$cookies', 'AccountService', 'Event', function ($scope, $rootScope, $timeout, $cookies, AccountService, Event) {

    $scope.init = function () {
        $scope.status = {};
        $scope.model = angular.copy($scope.user);
    };

    $scope.edit = function () {
        window.location.href = '#/account';
    };

    $scope.update = function (form) {
        $scope.is_submit = true;
        if ((($scope.model.password && $scope.model.password === $scope.model.confirm_password && $scope.model.old_password) || !$scope.model.password) && form.$valid) {
            $scope.status = {};
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.update($scope.model).then(function (res) {
                $scope.status.success = true;
                window.carcare.user = res.data.data;
                $rootScope.$broadcast(Event.Load.Dismiss);
                $rootScope.$broadcast(Event.User.Update);
                $timeout(function () {
                    $scope.status = {};
                    $scope.is_submit = false;
                }, 5000);

            }).catch(function (res) {
                if (res.data && res.data.error.message === 'INVALID OLD PASSWORD') {
                    $scope.status.invalid_password = true;
                }
                else {
                    $scope.status.error = true;
                }
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }
    };

    $scope.logout = function () {
        AccountService.logout().then(function () {
            $cookies.remove('Authorization');
            window.location.href = '/';
        }).catch(function () {
            alert('ERROR');
        });
    };

    $scope.$on('USER_LOADED', $scope.init);
    $scope.init();
}]);
