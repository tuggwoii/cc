'use strict';
module.controller('NewRepairController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'RepairService', 'Event', 'Helper', 'ShopService', 'WorkService', 'CarService', 'WorkgroupService',
    function ($scope, $rootScope, $timeout, $q, $location, RepairService, Event, Helper, ShopService, WorkService, CarService, WorkgroupService) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        $scope.carId = $scope.params.car;

        function initModel () {
            $scope.model = {
                car: $scope.carId,
                date: new Date()
            };
            $scope.model.year = ($scope.model.date.getFullYear() + 543) + '';
            $scope.model.month = ($scope.model.date.getMonth() + 1) + '';
            $scope.model.day = $scope.model.date.getDate() + '';
            console.log($scope.model);
        }

        $scope.newRepair = function () {
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    
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
                        WorkgroupService.get().then(function (res) {
                            $scope.workgroup = angular.copy(res.data);
                        })
                    ]).then(function () {
                        initModel();
                        $scope.displayView();
                    });
                }
                else {
                    window.location.hash = '#/';
                }
            }
            else {
                $timeout(function () {
                    $scope.newRepair();
                }, 200);
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.add = function (form) {
            $scope.form_submit = true;
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid) {
                if ($scope.model.day && $scope.model.month && $scope.model.year && !isNaN(parseInt($scope.model.year))) {
                    $scope.model.date = new Date(parseInt($scope.model.year - 543), parseInt($scope.model.month) - 1, $scope.model.day);
                    $rootScope.$broadcast(Event.Load.Display);
                    $scope.status = {};
                    RepairService.create($scope.model).then(function (res) {
                        $scope.model.id = res.data.id;
                        if ($scope.from_car) {
                            $scope.navigateTo('#/repair?id=' + res.data.id + '&car=' + $scope.carId);
                        }
                        else {
                            $scope.navigateTo('#/repair?id=' + res.data.id);
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
                    $scope.status.invalid = true;
                    if (isNaN(parseInt($scope.model.year))) {
                        $scope.status.invalid_year = true;
                    }
                }
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.pickCar = function (car) {
            if ($scope.from_car) {
                $scope.navigateTo('#/car?id=' + car.id);
            }
            else {
                $scope.model.car = car.id + '';
                angular.forEach($scope.cars, function (_car) {
                    _car.active = false;
                });
                car.active = true;
            }
        };

        $scope.newRepair();
    }]);
$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});