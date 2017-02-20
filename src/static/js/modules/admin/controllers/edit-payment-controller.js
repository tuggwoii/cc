'use strict';
module.controller('EditPaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'PaymentService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, PaymentService, CarService, Event, Helper) {

        $scope.status = {};
        $scope.params = $location.search();
        $scope.id = $scope.params.id;

        function loadResources() {
            $q.all([
                   PaymentService.getById($scope.id).then(function (res) {
                       $scope.model = angular.copy(res);
                       $scope.model.status = $scope.model.status + '';
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

        function isValid() {
            return $scope.user && $scope.user.id && $scope.id;
        }

        $scope.submit = function (form) {
            $scope.status = {};
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid && !isNaN(parseFloat($scope.model.price))) {
                $rootScope.$broadcast(Event.Load.Display);
                PaymentService.update($scope.model).then(function (res) {
                    $scope.status.success = true;
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $timeout(function () {
                        $scope.status.success = false;
                    }, 5000);
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
                    window.location.hash = '#/';
                }
            }
            else {
                $timeout(function () {
                    $scope.paymentPage();
                }, 200);
            }
        };

        $scope.delete = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                PaymentService.delete($scope.id).then(function () {
                    window.location.hash = '#/payment';
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $timeout(function () {
                        $rootScope.$broadcast(Event.Message.Display, 'ลบไม่ได้กรุณาลองใหม่หรือติดต่อผู้ดูแล');
                    }, 500);
                });
            });
        };

        $scope.paymentPage();
    }]);
