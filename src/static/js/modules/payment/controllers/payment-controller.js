'use strict';
module.controller('PaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'PaymentService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, PaymentService, CarService, Event, Helper) {

        $scope.id = Helper.getQueryStringValue('id');
        $scope.isDetail = $scope.id ? true : false;

        function generateDateTimeDropdown() {
            $scope.hours = [];
            $scope.mins = [];
            $scope.days = [];
            $scope.months = [];
            $scope.years = [];

            for (var i = 0; i < 24; i++) {
                if (i < 10) {
                    $scope.hours.push( '0' + i);
                }
                else {
                    $scope.hours.push('' + i);
                }
            }

            for (var j = 0; j < 60; j++) {
                if (j < 10) {
                    $scope.mins.push('0' + j);
                }
                else {
                    $scope.mins.push('' + j);
                }
            }

            for (var k = 1; k <= 31; k++) {
                if (k < 10) {
                    $scope.days.push('0' + k);
                }
                else {
                    $scope.days.push('' + k);
                }
            }

            for (var l = 1; l <= 12; l++) {
                if (l < 10) {
                    $scope.months.push('0' + l);
                }
                else {
                    $scope.months.push('' + l);
                }
            }

            var now = new Date();
            var final_year = now.getFullYear() + 543;
            for (var current_year = 2558; current_year <= final_year; current_year++) {
                $scope.years.push(current_year + '');
            }
        }

        function setDateToCurrent() {
            var date = new Date();
            $scope.model.h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + '';
            $scope.model.m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + '';
            $scope.model.d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
            $scope.model.mo = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) + '';
            $scope.model.y = (date.getFullYear() + 543) + '';
        }

        function loadResources() {
            if (!$scope.isDetail) {
                $q.all([
                    CarService.get().then(function (res) {
                        $scope.cars = angular.copy(res.data);
                    }),
                    PaymentService.captcha().then(function (res) {
                        $scope.captcha = res.data;
                    })
                ]).then(function () {
                    $scope.model = {
                        telephone: window.carcare.user.telephone
                    };
                    $scope.model.key = $scope.captcha.key;
                    generateDateTimeDropdown();
                    setDateToCurrent();
                    $scope.displayView();
                });
            }
            else {
                $q.all([
                    PaymentService.getById($scope.id).then(function (res) {
                        $scope.model = angular.copy(res);
                        if ($scope.model.car_ids) {
                            CarService.getByIds($scope.model.car_ids).then(function (res) {
                                $scope.model.relate_cars = res;
                            });
                        }
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

        function getPayDate(model) {
            return model.h + ":" + model.m + " " + model.d + "-" + model.mo + "-" + model.y;
        }

        $scope.submit = function (form) {
            $scope.status = {};
            $scope.is_submit = true;
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid && !isNaN(parseFloat($scope.model.price)) && $scope.model.captcha === $scope.captcha.captcha) {
                $scope.model.datetime = getPayDate($scope.model);
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
