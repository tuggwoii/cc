'use strict';
module.controller('IndexController', ['$scope', '$q', '$timeout', 'WorkgroupService', 'CarService', 'NotificationService', 'ShareService', 'Helper',
    function ($scope, $q, $timeout, WorkgroupService, CarService, NotificationService, ShareService, Helper) {

        function initModel(items) {
            angular.forEach(items, function (i) {
                i.date_str = Helper.readableDate(i.date);
            });
        }

        function notLoginUser() {
            $q.all([
                WorkgroupService.get().then(function (data) {
                    $scope.workgroup = angular.copy(data);
                }),
                ShareService.get(1, { limits: 12 }).then(function (res) {
                    $scope.shares = res.data;
                })
            ])
            .then(function () {
                $scope.displayView();
            })
            .catch(function () {
                $scope.displayView();
            });
        }

        function loginUser() {
            $q.all([
                CarService.get().then(function (res) {
                    $scope.cars = res.data;
                }),
                WorkgroupService.get().then(function (data) {
                    $scope.workgroup = angular.copy(data);
                }),
                NotificationService.getByType(1).then(function (res) {
                    $scope.dateNotifications = res;
                    initModel($scope.dateNotifications);
                }),
                NotificationService.getByType(2).then(function (res) {
                    $scope.mileNotifications = res;
                    initModel($scope.mileNotifications);
                }),
                ShareService.get(1, { limits: 12 }).then(function (res) {
                    $scope.shares = res.data;
                })
            ])
            .then(function () {
                $scope.displayView();
            })
            .catch(function () {
                $scope.displayView();
            });
        };

        $scope.loadIndex = function () {
            if ($scope.user_ready && $scope.strings_ready) {
                $scope.cars = [];
                if ($scope.user && $scope.user.id) {
                    loginUser();
                }
                else {
                    notLoginUser();
                }
            }
            else {
                $timeout(function () {
                    $scope.loadIndex();
                }, 500);
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.loadIndex();
}]);
