'use strict';
module.controller('RepairsController', ['$scope', '$timeout', '$rootScope', '$q', 'RepairService', 'Helper', 'Event', function ($scope, $timeout, $rootScope, $q, RepairService, Helper, Event) {

    $scope.isRepairsPage = true;

    function initModel(items) {
        angular.forEach(items, function (i) {
            i.score = i.score + '';
            i.date_str = Helper.readableDate(i.date);
        });
    }

    $scope.init = function () {
        $scope.page = 1;
        $rootScope.$broadcast(Event.Car.Clear);
        $scope.getAll();
    };

    $scope.getAll = function () {
        $rootScope.$broadcast(Event.Load.Display, 'GET_REPAIR');
        $q.all([
        RepairService.get($scope.page, $scope.carId).then(function (res) {
            $scope.repairs = res.data;
            initModel($scope.repairs);
            $scope.pagings(res.meta);
        })])
        .then(function () {
            $rootScope.$broadcast(Event.Load.Dismiss, 'GET_REPAIR');
        }).catch(function () {
            $rootScope.$broadcast(Event.Load.Dismiss, 'GET_REPAIR');
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
