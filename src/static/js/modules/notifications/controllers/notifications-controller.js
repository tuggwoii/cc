'use strict';
module.controller('NotificationsController', ['$scope', '$timeout', '$rootScope', '$q', 'NotificationService', 'CarService', 'WorkgroupService', 'Helper', 'Event',
function ($scope, $timeout, $rootScope, $q, NotificationService, CarService, WorkgroupService, Helper, Event) {

    $scope.isNotificationsPage = true;
    $scope.cars_ = [];
    $scope.query = {
        status: 'true'
    };
    
    function isValid() {
        return $scope.user && $scope.user.id;
    }

    function initModel(items) {
        angular.forEach(items, function (i) {
            i.date_str = Helper.readableDate(i.date);
        });
    }

    function separateNotificationType(cars) {
        angular.forEach(cars, function (car) {
            car.noti_date = [];
            car.noti_mile = [];
            angular.forEach(car.notification_list, function (noti) {
                noti.date_str = Helper.readableDate(noti.date);
                if (noti.type == 1) {
                    car.noti_date.push(noti);
                }
                else {
                    car.noti_mile.push(noti);
                }
            });
            car.noti_date.sort(function (a, b) { return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0); });
            car.noti_mile.sort(function (a, b) { return (a.mile > b.mile) ? 1 : ((b.mile > a.mile) ? -1 : 0); });
            car.all_noti_date = angular.copy(car.noti_date);
            car.all_noti_mile = angular.copy(car.noti_mile);
        });
        $scope.cars_ = angular.copy($scope.cars);
    }

    $scope.notificationsPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                $scope.page = 1;
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
                separateNotificationType($scope.cars);
            }),
            WorkgroupService.get().then(function (res) {
                $scope.works = angular.copy(res.data);
            })
        ]).then(function () {
            $scope.filter();
            $scope.displayView();
        });
    };

    $scope.filter = function () {
        if ($scope.carId) {
            $scope.cars_ = [];
            angular.forEach($scope.cars, function (car) {
                if (car.id == $scope.carId) {
                    $scope.cars_.push(car);
                }
            });
        }
        else {
            $scope.cars_ = angular.copy($scope.cars);
        }
        $scope.query_data($scope.cars_);
    };

    $scope.query_data = function (cars) {
        angular.forEach(cars, function (car) {
            car.noti_date = [];
            car.noti_mile = [];
            angular.forEach(car.all_noti_date, function (noti) {
                if ((!$scope.query.status || ((noti.enable && $scope.query.status == 'true') || (!noti.enable && $scope.query.status == 'false'))) && (!$scope.query.work || noti.work == $scope.query.work)) {
                    car.noti_date.push(noti);
                }
            });
            angular.forEach(car.all_noti_mile, function (noti) {
                if ((!$scope.query.status || ((noti.enable && $scope.query.status == 'true') || (!noti.enable && $scope.query.status == 'false'))) && (!$scope.query.work || noti.work == $scope.query.work)) {
                    car.noti_mile.push(noti);
                }
            });
        });
    }

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
        $scope.navigateTo('#/car?id=' + car.id);
    };

    $scope.carFilter = function (car) {
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
    }

    $scope.notificationsPage();
}]);
