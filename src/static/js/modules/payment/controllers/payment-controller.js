﻿'use strict';
module.controller('PaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'PaymentService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, PaymentService, CarService, Event, Helper) {

        $scope.id = Helper.getQueryStringValue('id');
        console.log($scope.id);
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
                        console.log($scope.model);
                    }).catch(function () {
                        $scope.notfound = true;
                    })
                ]).then(function () {
                    $scope.displayView();
                });
            }
        }

        function setInitModel(model) {
            if (model.date) {
                var date = new Date(model.date);
                model.date_str = Helper.readableDate(date);
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


        $scope.paymentPage();
    }]);