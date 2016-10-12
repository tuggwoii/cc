'use strict';
module.controller('ForgotPasswordController', ['$scope', '$rootScope', '$timeout', '$cookies', 'AccountService', 'CarService', 'Event', function ($scope, $rootScope, $timeout, $cookies, AccountService, CarService, Event) {

    function isValid() {
        return !$scope.user || !$scope.user.id;
    }

    $scope.status = {};


    $scope.setForm = function (form) {
        $scope.form = form;
    };

    $scope.forgotPasswordPage = function () {

        if ($scope.user_ready) {
            if (isValid()) {
                $scope.status = {};
                $scope.model = angular.copy($scope.user);

                $scope.displayView();
            }
            else {
                window.location.hash = '#/';
            }
        }
        else {
            $timeout(function () {
                $scope.accountPage();
            }, 200);
        }
    };

    $scope.edit = function () {
        window.location.href = '#/account';
    };

    $scope.submit = function (form) {
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid) {

        }
        else {
            $scope.status.invalid = true;
        }
    };

    $scope.forgotPasswordPage();
}]);
