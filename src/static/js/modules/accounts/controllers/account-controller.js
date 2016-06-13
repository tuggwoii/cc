'use strict';
module.controller('AccountController', ['$scope', '$rootScope', '$cookies', 'AccountService', function ($scope, $rootScope, $cookies, AccountService) {

    $scope.init = function () {
        $scope.status = {};
        $scope.model = angular.copy($scope.user);
    };

    $scope.edit = function () {
        window.location.href = '#/account';
    };

    $scope.update = function (form) {
        if ((($scope.model.password && $scope.model.password === $scope.model.confirm_password) || !$scope.model.password) && form.$valid) {
            $scope.status = {};
            AccountService.update($scope.model).then(function (res) {
                window.cheepow.user = res.data.data;
               $rootScope.$broadcast('UPDATE_USER');
            }).catch(function (res) {
                console.log(res);
                if (res.data && res.data.error.message === 'INVALID OLD PASSWORD') {
                    $scope.status.message = 'Invalid old password';
                }
                else {
                    $scope.status.error = true;
                }
            });
        }
        else {
            if ($scope.model.password && ($scope.model.password != $scope.model.confirm_password)) {
                $scope.status.message = 'Password not match with confirm';
            }
            else if ($scope.model.password && !$scope.model.old_password) {
                $scope.status.message = 'Old password required';
            }
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
