'use strict';
module.controller('CarController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, CarService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.process = [];
        $scope.params = $location.search();
        $scope.isCarPage = $location.$$path.indexOf('/car')>-1;
        $scope.isCarDetail = $scope.params.id && $scope.isCarPage;

        function getById () {
            CarService.getById($scope.params.id).then(function (data) {
                $scope.model = data;
                setModelDate($scope.model);
            }).catch(function () {

            });
        }

        function setModelDate (model) {
            model.date = new Date(model.date);
            model.day = model.date.getDate() + '';
            model.month = (model.date.getMonth() + 1) + '';
        }

        $scope.init = function () {
            $scope.process = [];
            $scope.model = {};
            if ($scope.params.id && $scope.isCarPage) {
                getById();
            }
            else {
                $scope.getCars();
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.add = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.model.brand && $scope.model.series && $scope.model.serial) {
                $rootScope.$broadcast(Event.Load.Display);
                $scope.status = {};
                if ($scope.model.day && $scope.model.month && $scope.model.year) {
                    $scope.model.date = new Date($scope.model.year, parseInt($scope.model.month) - 1, $scope.model.day);
                }
                CarService.create($scope.model).then(function () {
                    CarService.get().then(function (res) {
                        $scope.cars = res.data;
                        $scope.navigateTo('#/');
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    });
                }).catch(function (res) {
                    if (res.error.message === 'MAX CAR') {
                        $scope.status.maxcar = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.update = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.model.id && $scope.model.brand && $scope.model.series && $scope.model.serial) {
                $rootScope.$broadcast(Event.Load.Display);
                $scope.status = {};
                if ($scope.model.day && $scope.model.month && $scope.model.year) {
                    $scope.model.date = new Date($scope.model.year, parseInt($scope.model.month) - 1, $scope.model.day);
                }
                CarService.update($scope.model).then(function (car) {
                    CarService.get().then(function (res) {
                        $scope.cars = res.data;
                        $scope.model = car;
                        $scope.status.success = true;
                        setModelDate($scope.model);
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        $timeout(function () {
                            $scope.status = {};
                        }, 5000);
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    });
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

        $scope.getCars = function () {
            CarService.get().then(function (res) {
                $rootScope.$broadcast(Event.Car.Update, res.data);
            });
        };

        $scope.setImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
                if ($scope.model.id) {
                    $scope.update($scope.form);
                }
            }
        };

        $scope.view = function (car) {
            if ($scope.isNotificationPage || $scope.isNotificationsPage || $scope.isRepairPage || $scope.isRepairsPage) {
                if (car.active) {
                    $rootScope.$broadcast(Event.Car.Clear);
                    $rootScope.$broadcast(Event.Car.PickCar, '');
                }
                else {
                    $rootScope.$broadcast(Event.Car.Clear);
                    car.active = true;
                    $rootScope.$broadcast(Event.Car.PickCar, car.id);
                }
            }
            else {
                CarService.saveCurrent(car);
                $scope.navigateTo('#/car?id=' + car.id);
            }
        };

        $scope.$on(Event.Page.Ready, function () {
            $scope.init();
        });

        $scope.init();
        $scope.$on(Event.File.Success, $scope.setImage);
}]);
