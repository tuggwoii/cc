'use strict';
module.controller('EditNotificationController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'NotificationService', 'CarService', 'WorkgroupService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, NotificationService, CarService, WorkgroupService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        if ($scope.from_car) {
            $scope.carId = $scope.params.car;
        }

        function getById() {
            $q.all([
                NotificationService.getById($scope.params.id).then(function (data) {
                    $scope.model = angular.copy(data);
                    setInitModel($scope.model);

                }).catch(function () {
                    alert('ERROR LOAD NOTIFICATION');
                }),
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
                $scope.displayView();
            });
        }

        function setInitModel(model) {
            model.car = model.for_car + '';
            model.type = model.type + '';
            model.work = model.work + '';
            if (model.date) {
                var date = new Date(model.date);
                model.year = date.getFullYear() +543;
                model.month = (date.getMonth() + 1) +'';
                model.day = date.getDate() + '';
            }
            $rootScope.$broadcast(Event.Car.SetActive, model.car);
        }

        function isValid() {
            return $scope.params.id && $scope.user && $scope.user.id;
        }

        $scope.editNotificationPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    getById();
                }
                else {
                    window.location.hash = '#!/';
                }
            }
            else {
                $timeout(function () {
                    $scope.editNotificationPage();
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
            if (form.$valid) {
                if (($scope.model.day && $scope.model.month && $scope.model.year && !isNaN(parseInt($scope.model.year)) || $scope.model.type == 2) && $scope.model.car) {
                    $rootScope.$broadcast(Event.Load.Display);
                    if ($scope.model.type != 2) {
                        $scope.model.date = new Date(parseInt($scope.model.year - 543), parseInt($scope.model.month) - 1, $scope.model.day);
                    }
                    $scope.status = {};
                    NotificationService.update($scope.model).then(function (res) {
                        if ($scope.from_car) {
                            $scope.navigateTo('#!/notification?id=' + $scope.model.id + '&car=' + $scope.carId);
                        }
                        else {
                            $scope.navigateTo('#!/notification?id=' + $scope.model.id);
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

        $scope.remove = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                NotificationService.delete($scope.params.id).then(function () {
                    if ($scope.from_car) {
                        $scope.navigateTo('#!/car?id=' + $scope.carId);
                    }
                    else {
                        $scope.navigateTo('#!/notifications');
                    }
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    alert('ERROR');
                });
            });
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.editNotificationPage();
    }]);
