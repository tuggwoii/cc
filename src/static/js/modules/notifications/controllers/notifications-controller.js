'use strict';
module.controller('NotificationsController', ['$scope', '$timeout', '$rootScope', '$q', 'NotificationService', 'Helper', 'Event', function ($scope, $timeout, $rootScope, $q, NotificationService, Helper, Event) {

    $scope.isNotificationsPage = true;

    function initModel(items) {
        angular.forEach(items, function (i) {
            i.date_str = Helper.readableDate(i.date);
        });
    }

    $scope.init = function () {
        $scope.page = 1;
        $rootScope.$broadcast(Event.Car.Clear);
        $scope.getAll();
    };

    $scope.getAll = function () {
        $rootScope.$broadcast(Event.Load.Display, 'GET_NOTIFICATION');
        $q.all([
        NotificationService.get(0, $scope.page, $scope.carId).then(function (res) {
            $scope.notifications = res.data;
            $scope.pagings(res.meta);
            initModel($scope.notifications);
        }),
        NotificationService.getByType(1).then(function (res) {
            $scope.dateNotifications = res;
            initModel($scope.dateNotifications);
        }),
        NotificationService.getByType(2).then(function (res) {
            $scope.mileNotifications = res;
            initModel($scope.mileNotifications);
        })])
        .then(function () {
            $rootScope.$broadcast(Event.Load.Dismiss, 'GET_NOTIFICATION');
        }).catch(function () {
            $rootScope.$broadcast(Event.Load.Dismiss, 'GET_NOTIFICATION');
        })
    };

    $scope.$on(Event.Car.PickCar, function (event, carId) {
        $scope.carId = carId;
        $scope.page = 1;
        $scope.getAll();
    });

    $scope.gotoPage = function (page) {
        if (page > $scope.pages.length) {
            page = $scope.pages.length;
        }
        else if (page < 1) {
            page = 1;
        }
        if ($scope.page != page) {
            $scope.page = page;
            $scope.getAll();
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

    $scope.init();
}]);
