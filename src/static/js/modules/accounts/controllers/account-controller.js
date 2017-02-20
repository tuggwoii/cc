'use strict';
module.controller('AccountController', ['$scope', '$rootScope', '$timeout', '$cookies', 'AccountService', 'CarService', 'Event', function ($scope, $rootScope, $timeout, $cookies, AccountService, CarService, Event) {

    function isValid() {
        return $scope.user && $scope.user.id;
    }

    $scope.setForm = function (form) {
        $scope.form = form;
    };

    $scope.accountPage = function () {

        if ($scope.user_ready) {
            if (isValid()) {
                $scope.status = {};
                $scope.model = angular.copy($scope.user);

                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                    $scope.displayView();
                });
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

    $scope.update = function (form) {
        $scope.is_submit = true;
        if ((($scope.model.password && $scope.model.password === $scope.model.confirm_password) || !$scope.model.password) && form.$valid) {
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

    $scope.setProfileImage = function (event, file) {
        $scope.model.image = file;
        window.carcare.user.image = file;
        $rootScope.$broadcast(Event.User.Update);
        $scope.update($scope.form);
    };

    $scope.editAccount = function () {
        $scope.navigateTo('#/update-account');
    };

    $scope.pickCar = function (car) {
        $scope.navigateTo('#/car?id=' + car.id);
    };

    var lightbox = lity();

    $scope.simpleLightbox = function (url) {
        lightbox(url);
    };

    $scope.$on(Event.File.Success, $scope.setProfileImage);
    $scope.accountPage();
}]);
