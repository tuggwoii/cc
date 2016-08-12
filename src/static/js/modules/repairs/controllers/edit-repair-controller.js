'use strict';
module.controller('EditRepairController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'RepairService', 'Event', 'Helper', 'ShopService', 'WorkService', 'CarService', 'WorkgroupService',
    function ($scope, $rootScope, $timeout, $q, $location, RepairService, Event, Helper, ShopService, WorkService, CarService, WorkgroupService) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.carId = $scope.params.car;
        $scope.from_car = $scope.params.car ? true : false;

        function getById() {
            RepairService.getById($scope.params.id).then(function (data) {
                $scope.model = angular.copy(data);
                initModel($scope.model);
            }).catch(function () {

            });
        }

        function initModel(model) {
            model.type = model.type + '';
            model.work = model.work + '';

            if (model.date) {
                var date = new Date(model.date);
                model.year = (date.getFullYear() + 543) + '';
                model.month = (date.getMonth() + 1) +'';
                model.day = date.getDate() + '';
            }
        }

        $scope.editRepair = function () {
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
                        WorkgroupService.get().then(function (data) {
                            $scope.workgroup = angular.copy(data);
                        }),
                        getById()
                    ]).then(function () {
                        $scope.displayView();
                    });
                }
                else {
                    window.location.hash = '#/';
                }
            }
            else {
                $timeout(function () {
                    $scope.editRepair();
                }, 200);
            }
        };

        $scope.update = function () {
            $scope.form_submit = true;
            angular.forEach($scope.form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.form.$valid) {
                if ($scope.model.day && $scope.model.month && $scope.model.year && !isNaN(parseInt($scope.model.year))) {
                    $scope.model.date = new Date(parseInt($scope.model.year - 543), parseInt($scope.model.month) - 1, $scope.model.day);
                    $rootScope.$broadcast(Event.Load.Display);
                    $scope.status = {};
                    RepairService.update($scope.model).then(function (res) {
                        if ($scope.from_car) {
                            $scope.navigateTo('#/repair?id=' + res.id + '&car=' + $scope.carId);
                        }
                        else {
                            $scope.navigateTo('#/repair?id=' + res.id);
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

        $scope.setForm = function (form) {
            $scope.form = form;
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

        $scope.editRepair();

    }]);
$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});