'use strict';
module.controller('NewNotificationController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'NotificationService', 'CarService', 'WorkgroupService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, NotificationService, CarService, WorkgroupService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        $scope.carId = $scope.params.car;

        $scope.newNotificationPage = function () {
            $scope.model = {
                enable: true
            };
            if ($scope.from_car) {
                $scope.model.car = $scope.carId;
            }
            $q.all([
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                    if ($scope.from_car) {
                        angular.forEach($scope.cars, function (_car) {
                            if (_car.id == $scope.carId) {
                                _car.active = true;
                            }
                        });
                    }
                }),
                WorkgroupService.get().then(function (data) {
                     $scope.workgroup = angular.copy(data);
                })
            ]).then(function () {
                $scope.displayView();
            });
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.add = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid) {
                if (($scope.model.day && $scope.model.month && $scope.model.year && !isNaN(parseInt($scope.model.year)) || $scope.model.type == 2) && $scope.model.car) {
                    $rootScope.$broadcast(Event.Load.Display);
                    if ($scope.model.type != 2) {
                        $scope.model.date = new Date(parseInt($scope.model.year - 543), parseInt($scope.model.month) - 1, $scope.model.day);
                    }
                    $scope.status = {};
                    NotificationService.create($scope.model).then(function (res) {
                        if ($scope.from_car) {
                            $scope.navigateTo('#/car?id=' + $scope.carId);
                        }
                        else {
                            $scope.navigateTo('#/notifications');
                        }
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
                    if (!$scope.model.car) {
                        $scope.status.car = true;
                    }
                    if (isNaN(parseInt($scope.model.year)) && $scope.model.type != 2) {
                        $scope.status.invalid_year = true;
                    }
                    $scope.status.invalid = true;
                }
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.carChange = function () {
            angular.forEach($scope.cars, function (_car) {
                if (_car.id == $scope.model.car) {
                    _car.active = true;
                }
                else {
                    _car.active = false;
                }
            });
        }

        $scope.pickCar = function (car) {
            if ($scope.from_car) {
                $scope.navigateTo('#/car?id=' + car.id);
            }
            else {
                $scope.model.car = car.id+'';
                angular.forEach($scope.cars, function (_car) {
                    _car.active = false;
                });
                car.active = true;
            }
        };

        $scope.newNotificationPage();
    }]);
