'use strict';
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

        function validateCar() {
            return $scope.model.id && $scope.model.brand && $scope.model.city && $scope.model.series && $scope.model.serial && (!$scope.model.year || !isNaN(parseInt($scope.model.year)));
        }

        function setModelDate(model) {
            if (model.year == 0) {
                model.year = '';
            }
            if (model.month == 0) {
                model.month = '';
            }
            else {
                model.month = model.month + '';
            }
            if (model.day == 0) {
                model.day = '';
            }
            else {
                model.day = model.day + '';
            }
        }

        function createProvinces() {
            $scope.provinces = [];
            angular.forEach(areas, function (area) {
                angular.forEach(area.areas, function (p) {
                    $scope.provinces.push(p);
                });
            });
            $scope.provinces.sort(function (a, b) { return (a.th > b.th) ? 1 : ((b.th > a.th) ? -1 : 0); })
        }

        $scope.editCarPage = function () {
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
                    $scope.editCarPage();
                }, 200);
            }

            createProvinces();
            $rootScope.$broadcast(Event.File.SetType, 2);
        };

        $scope.setForm = function (form) {
            $scope.form = form;
            window.currentForm = form;
        };

        $scope.update = function (notRedirect) {
            angular.forEach(currentForm.$error.required, function (field) {
                field.$setDirty();
            });
            if (validateCar()) {
                $rootScope.$broadcast(Event.Load.Display);
                $scope.status = {};
                if ($scope.model.year) {
                    $scope.model.year = parseInt($scope.model.year);
                }
                if ($scope.model.day) {
                    $scope.model.day = parseInt($scope.model.day);
                }
                if ($scope.model.month) {
                    $scope.model.month = parseInt($scope.model.month);
                }
                CarService.update($scope.model).then(function (car) {
                    if (notRedirect) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }
                    else {
                        window.location.href = '/#!/car?id=' + $scope.model.id;
                    }
                }).catch(function (res) {
                    console.log(res);
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
                        $scope.navigateTo('#!/');
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    });
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.status.error_remove = true;
                });
            });
        };

        $scope.setCarImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
                $scope.update(true);
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.$on(Event.File.Success, $scope.setCarImage);
        $scope.editCarPage();
    }]);
