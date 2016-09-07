'use strict';
module.controller('EditShopController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Event', 'Helper', 'ShopService', 'WorkService', 'CarService', 'WorkgroupService',
    function ($scope, $rootScope, $timeout, $q, $location, Event, Helper, ShopService, WorkService, CarService, WorkgroupService) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.carId = $scope.params.car;
        $scope.from_car = $scope.params.car ? true : false;
        $scope.provinces = [];

        function getById() {
            ShopService.getById($scope.params.id).then(function (data) {
                $scope.model = angular.copy(data);
                initModel($scope.model);
            }).catch(function () {

            });
        }

        function initModel(model) {
            
        }

        function createProvinces(model) {
            angular.forEach(areas, function (area) {
                angular.forEach(area.areas, function (p) {
                    $scope.provinces.push(p);
                });
            });
            $scope.provinces.sort(function (a, b) { return (a.th > b.th) ? 1 : ((b.th > a.th) ? -1 : 0); })
        }

        function loadResource() {
            if ($scope.user && $scope.user.id) {
                createProvinces();
                $q.all([
                    getById(),
                    CarService.get().then(function (res) {
                        $scope.cars = angular.copy(res.data);
                    })
                ]).then(function () {
                    $scope.displayView();
                });
            }
            else {
                $scope.displayView();
            }
        }

        $scope.editShop = function () {
            if ($scope.user_ready) {
                loadResource();
            }
            else {
                $timeout(function () {
                    $scope.editShop();
                }, 200);
            }
        };

        $scope.update = function () {
            $scope.form_submit = true;
            $scope.status = {};
            angular.forEach($scope.form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.form.$valid) {
                $rootScope.$broadcast(Event.Load.Display);
                ShopService.update($scope.model).then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.status.error = true;
                });
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.setImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
            }
        };

        $scope.$on(Event.File.Success, $scope.setImage);
        $scope.editShop();

    }]);
$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});