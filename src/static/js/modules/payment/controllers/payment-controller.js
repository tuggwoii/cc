'use strict';
module.controller('PaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'PaymentService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, PaymentService, CarService, Event, Helper) {

        $scope.id = Helper.getQueryStringValue('id');
        $scope.isDetail = $scope.id ? true : false;

        function loadResources() {
            if (!$scope.isDetail) {
                $q.all([
                    CarService.get().then(function (res) {
                        $scope.cars = angular.copy(res.data);
                    })
                ]).then(function () {
                    $scope.model = {};
                    $scope.displayView();
                });
            }
            else {
                $q.all([
                    PaymentService.getById($scope.id).then(function (res) {
                        $scope.model = angular.copy(res);
                        CarService.getByIds($scope.model.car_ids).then(function (res) {
                            $scope.model.relate_cars = res;
                        });
                    }).catch(function () {
                        $scope.notfound = true;
                    })
                ]).then(function () {
                    $scope.displayView();
                });
            }
        }

        function isValid() {
            return $scope.user && $scope.user.id;
        }

        $scope.submit = function (form) {
            $scope.status = {};
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid && !isNaN(parseFloat($scope.model.price))) {
                $rootScope.$broadcast(Event.Load.Display);
                PaymentService.create($scope.model).then(function (res) {
                    window.location.href = '/payment?id=' + res.data.id;
                }).catch(function () {
                    $scope.status.error = true;
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }
            else {
                $scope.status.invalid = true;
                if (isNaN(parseFloat($scope.model.price))) {
                    $scope.status.invalid_price = true;
                }
            }
        };

        $scope.paymentPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    loadResources();
                }
                else {
                    window.location.href = '/';
                }
            }
            else {
                $timeout(function () {
                    $scope.paymentPage();
                }, 200);
            }
        };

        $scope.carChecked = function (work) {
            work.checked = !work.checked;
            $scope.setServices();
        };

        $scope.setServices = function () {
            $scope.model.car = '';
            var count = 0;
            angular.forEach($scope.cars, function (c) {
                if (c.checked) {
                    count++;
                    $scope.model.car += c.id + ',';
                }
            });
            if (!count) {
                $scope.model.car = '';
            }
        };

        $scope.paymentPage();
    }]);
