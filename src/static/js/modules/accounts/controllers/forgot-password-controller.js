'use strict';
module.controller('ForgotPasswordController', ['$scope', '$rootScope', '$timeout', '$location', 'AccountService', 'Event', function ($scope, $rootScope, $timeout, $location, AccountService, Event) {

    function isValid() {
        return !$scope.user || !$scope.user.id;
    }

    $scope.params = $location.search();
    $scope.status = {};
    $scope.model = {};
    $scope.recover = $scope.params.token ? true : false;

    $scope.setForm = function (form) {
        $scope.form = form;
    };

    $scope.forgotPasswordPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                if (!$scope.recover) {
                    $scope.displayView();
                }
                else {
                    AccountService.validateForgotPasswordToken({ token: $scope.params.token }).then(function (res) {
                        $scope.model = {
                            id: res.data.id,
                            token: $scope.params.token
                        };
                        console.log($scope.model);
                        $scope.displayView();
                    }).catch(function () {
                        $scope.recover = false;
                        $scope.displayView();
                    });
                }
            }
            else {
                window.location.hash = '#!/';
            }
        }
        else {
            $timeout(function () {
                $scope.forgotPasswordPage();
            }, 200);
        }
    };

    $scope.edit = function () {
        window.location.href = '#!/account';
    };

    $scope.submit = function (form) {
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid) {
            $scope.status = {};
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.forgotPassword($scope.model).then(function (res) {
                console.log(res);
                $scope.status.success = true;
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function (res) {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $scope.status.error = true;
            });
        }
        else {
            $scope.status.invalid = true;
        }
    };

    $scope.changePassword = function (form) {
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid && $scope.model.password == $scope.model.confirm_password) {
            $scope.status = {};
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.changePasswordByToken($scope.model).then(function (res) {
                $scope.status.success = true;
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function (res) {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $scope.status.error = true;
            });
        }
        else {
            $scope.status.invalid = true;
        }
    };

    $scope.forgotPasswordPage();
}]);
