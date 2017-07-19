'use strict';
module.controller('NewCarController', ['$scope', '$rootScope', '$timeout', '$location', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $location, CarService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();

        function validateCar() {
            return $scope.model.brand && $scope.model.series && $scope.model.city && $scope.model.serial && (!$scope.model.year || !isNaN(parseInt($scope.model.year)))
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

        $scope.newCarPage = function () {
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    $scope.model = {};
                    CarService.get().then(function (res) {
                        $scope.cars = angular.copy(res.data);
                        $scope.displayView();
                    })
                }
                else {
                    window.location.hash = '#!/';
                }
            }
            else {
                $timeout(function () {
                    $scope.newCarPage();
                }, 200);
            }
            
            createProvinces();
            $rootScope.$broadcast(Event.File.SetType, 2);
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.add = function (form) {
            angular.forEach(form.$error.required, function (field) {
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
                CarService.create($scope.model).then(function (res) {
                    $scope.navigateTo('#!/car?id=' + res.data.id);
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
                if ($scope.model.year && isNaN(parseInt($scope.model.year))) {
                    $scope.status.invalid_year = true;
                }
                $scope.status.invalid = true;
            }
        };

        
        $scope.setImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
                if ($scope.model.id) {
                    $scope.update($scope.form);
                }
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.newCarPage();
        $scope.$on(Event.File.Success, $scope.setImage);
    }]);
