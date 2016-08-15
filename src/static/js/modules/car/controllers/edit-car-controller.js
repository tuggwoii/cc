﻿'use strict';
module.controller('EditCarController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, CarService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();

        function getById() {
            $q.all([
                CarService.getById($scope.params.id).then(function (data) {
                    $scope.model = data;
                    setModelDate($scope.model);
                }).catch(function () {
                    alert('LOAD CAR ERROR');
                }),
                CarService.get().then(function (res) {
                     $scope.cars = angular.copy(res.data);
                 })
            ]).then(function () {
                $scope.displayView();
                angular.forEach($scope.cars, function (_car) {
                    if (_car.id == $scope.model.id) {
                        _car.active = true;
                    }
                });
            });
        }

        function isValid() {
            return $scope.user && $scope.user.id && $scope.params.id
        }

        function setModelDate(model) {
            model.date = new Date(model.date);
            model.day = model.date.getDate() + '';
            model.month = (model.date.getMonth() + 1) + '';
        }

        $scope.editCarPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    getById();
                }
                else {
                    window.location.hash = '#/';
                }
            }
            else {
                $timeout(function () {
                    $scope.editCarPage();
                }, 200);
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.update = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.model.id && $scope.model.brand && $scope.model.series && $scope.model.serial && (!$scope.model.year || !isNaN(parseInt($scope.model.year)))) {
                $rootScope.$broadcast(Event.Load.Display);
                $scope.status = {};
                if ($scope.model.year) {
                    $scope.model.year = parseInt($scope.model.year);
                }
                if ($scope.model.day && $scope.model.month && $scope.model.year) {
                    $scope.model.date = new Date($scope.model.year, parseInt($scope.model.month) - 1, $scope.model.day);
                }
                CarService.update($scope.model).then(function (car) {
                    window.location.href = '/#/car?id=' + $scope.model.id;
                }).catch(function (res) {
                    if (res.error.message == 'CAR EXPIRE') {
                        $scope.status.car_expire = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }
            else {
                if ($scope.model.year && isNaN(parseInt($scope.model.year))) {
                    $scope.status.invalid_year = true;
                }
                $scope.status.invalid = true;
            }
        };

        $scope.remove = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                CarService.delete($scope.params.id).then(function () {
                    CarService.get().then(function (res) {
                        $scope.navigateTo('#/');
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    });
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.status.error_remove = true;
                });
            });
        };

        $scope.setImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.editCarPage();
        $scope.$on(Event.File.Success, $scope.setImage);
    }]);