﻿'use strict';
module.controller('CarController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'CarService', 'NotificationService', 'RepairService', 'WorkgroupService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, CarService, NotificationService, RepairService, WorkgroupService, Event, Helper) {

        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.milePage = 1;
        $scope.datePage = 1;
        $scope.repairPage = 1;
        $scope.repair_query = {
            limit: 9999
        };

        function initModel(items) {
            angular.forEach(items, function (i) {
                i.date_str = Helper.readableDate(i.date);
            });
        }

        function loadResources() {
            $q.all([
                CarService.getById($scope.params.id).then(function (data) {
                    $scope.car = data;
                    $scope.repair_query.car = $scope.car.id;
                    setModelDate($scope.car);
                   
                }).catch(function () {
                    alert('LOAD CAR ERROR');
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (res) {
                     $scope.workgroup = angular.copy(res.data);
                }),
                 RepairService.getPreviousShop().then(function (res) {
                     $scope.previous_shops = res.data;
                 })
            ]).then(function () {
                angular.forEach($scope.cars, function (_car) {
                    if (_car.id == $scope.car.id) {
                        _car.active = true;
                    }
                });
                $q.all([
                       loadNotiByMile(),
                       loadNotiByDate(),
                       loadRepairs()
                ]).then(function () {
                    $scope.displayView();
                });
            });
        }

        function loadNotiByMile(notify) {
            return $q(function (resolve, reject) {
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Display);
                }
                NotificationService.get($scope.milePage, 2, $scope.car.id, 9999).then(function (res) {
                    $scope.noti_miles = res.data;
                    $scope.setMilePagings(res.meta);
                    if (notify) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }
                    resolve();
                });
            });
        }

        function loadNotiByDate(notify) {
            return $q(function (resolve, reject) {
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Display);
                }
                NotificationService.get($scope.datePage, 1, $scope.car.id, 9999).then(function (res) {
                    $scope.noti_date = res.data;
                    initModel($scope.noti_date);
                    $scope.setDatePagings(res.meta);
                    if (notify) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }
                    resolve();
                });
            });
        }

        function loadRepairs(notify) {
            return $q(function (resolve, reject) {
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Display);
                }
                RepairService.get($scope.repairPage, {
                    car: $scope.car.id,
                    limit: 9999
                }).then(function (res) {
                    $scope.repairs = res.data;
                    initModel($scope.repairs);
                    $scope.setRepairPagings(res.meta);
                    if (notify) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }
                    resolve();
                });
            });
        }

        function setModelDate (model) {
            model.date_str = Helper.readableDate(model.date);
            model.exp_date_str = Helper.readableDate(model.exp_date);
        }

        function isValid () {
            return $scope.user && $scope.user.id && $scope.params.id
        }

        $scope.carPage = function () {
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
                    $scope.carPage();
                }, 200);
            }
        };

        $scope.pickCar = function (car) {
            if ($scope.car != car.id) {
                window.location.href = '#/car?id=' + car.id;
                window.location.reload();
            }
        };

        $scope.setMilePagings = function (meta) {
            $scope.milePagings = [];
            $scope.mileTotal = meta.count;
            if (meta.count && meta.limits) {
                var page_count = Math.ceil(meta.count / meta.limits);
                for (var i = 1; i <= page_count; i++) {
                    $scope.milePagings.push(i);
                }
            }
        };

        $scope.setDatePagings = function (meta) {
            $scope.datePagings = [];
            $scope.dateTotal = meta.count;
            if (meta.count && meta.limits) {
                var page_count = Math.ceil(meta.count / meta.limits);
                for (var i = 1; i <= page_count; i++) {
                    $scope.datePagings.push(i);
                }
            }
        };

        $scope.setRepairPagings = function (meta) {

            $scope.repairPagings = [];
            $scope.repairTotal = meta.count;
            if (meta.count && meta.limits) {
                var page_count = Math.ceil(meta.count / meta.limits);
                for (var i = 1; i <= page_count; i++) {
                    $scope.repairPagings.push(i);
                }
            }
        };

        $scope.gotoMilePage = function (page) {
            if (page > $scope.milePagings.length) {
                page = $scope.milePagings.length;
            }
            else if (page < 1) {
                page = 1;
            }
            if ($scope.milePage != page) {
                $scope.milePage = page;
                loadNotiByMile(true);
            }
        };

        $scope.gotoDatePage = function (page) {
            if (page > $scope.datePagings.length) {
                page = $scope.datePagings.length;
            }
            else if (page < 1) {
                page = 1;
            }
            if ($scope.datePage != page) {
                $scope.datePage = page;
                loadNotiByDate(true);
            }
        };

        $scope.gotoRepairPage = function (page) {
            if (page > $scope.repairPagings.length) {
                page = $scope.repairPagings.length;
            }
            else if (page < 1) {
                page = 1;
            }
            if ($scope.repairPage != page) {
                $scope.repairPage = page;
                loadRepairs(true);
            }
        };

        $scope.filterRepair = function () {
            $rootScope.$broadcast(Event.Load.Display);
            console.log($scope.repair_query);
            RepairService.get($scope.repairPage, $scope.repair_query).then(function (res) {
                $scope.repairs = res.data;
                initModel($scope.repairs);
                $scope.setRepairPagings(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }

        $scope.carPage();
}]);
