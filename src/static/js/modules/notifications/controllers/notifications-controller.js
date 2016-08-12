'use strict';
module.controller('NotificationsController', ['$scope', '$timeout', '$rootScope', '$q', 'NotificationService', 'CarService', 'Helper', 'Event',
function ($scope, $timeout, $rootScope, $q, NotificationService, CarService, Helper, Event) {

    $scope.isNotificationsPage = true;
    
    function isValid() {
        $scope.page = 1;
        return true;
    }

    function initModel(items) {
        angular.forEach(items, function (i) {
            i.date_str = Helper.readableDate(i.date);
        });
    }

    $scope.notificationsPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                $scope.getAll();
            }
            else {
                window.location.hash = '#/';
            }
        }
        else {
            $timeout(function () {
                $scope.notificationsPage();
            }, 200);
        }
    };

    $scope.getAll = function () {
        $q.all([
            CarService.get().then(function (res) {
                $scope.cars = angular.copy(res.data);
            }),
            NotificationService.get($scope.page, 0, $scope.carId).then(function (res) {
                $scope.notifications = res.data;
                $scope.pagings(res.meta);
                initModel($scope.notifications);
            })
        ]).then(function () {
            $scope.displayView();
        });
    };

    $scope.filter = function () {
        $rootScope.$broadcast(Event.Load.Display);
        NotificationService.get($scope.page, 0, $scope.carId).then(function (res) {
            $scope.notifications = res.data;
            $scope.pagings(res.meta);
            initModel($scope.notifications);
            $rootScope.$broadcast(Event.Load.Dismiss);
        });
    };

    $scope.gotoPage = function (page) {
        if (page > $scope.pages.length) {
            page = $scope.pages.length;
        }
        else if (page < 1) {
            page = 1;
        }
        if ($scope.page != page) {
            $scope.page = page;
            $scope.filter();
        }
    };

    $scope.pagings = function (meta) {
        $scope.pages = [];
        $scope.total = meta.count;
        if (meta.count && meta.limits) {
            var page_count = Math.ceil(meta.count / meta.limits);
            for (var i = 1; i <= page_count; i++) {
                $scope.pages.push(i);
            }
        }
    };

    $scope.pickCar = function (car) {
        if ($scope.carId != car.id) {
            $scope.carId = car.id;
            angular.forEach($scope.cars, function (_car) {
                _car.active = false;
            });
            car.active = true;
        }
        else {
            car.active = false;
            $scope.carId = undefined;
        }
        $scope.page = 1;
        $scope.filter();
    };

    $scope.notificationsPage();
}]);
