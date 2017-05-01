'use strict';
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
                    window.location.href = '/'; 
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (res) {
                     $scope.workgroup = angular.copy(res.data);
                }),
                RepairService.getPreviousShop($scope.params.id).then(function (res) {
                    $scope.shops = res.data;
                    angular.forEach($scope.shops, function (s) {
                        s.province_str = getProvinceByKey(s.province);
                    });
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
                    $scope.noti_miles = [];
                    angular.forEach(res.data, function (n) {
                        if (n.enable) {
                            $scope.noti_miles.push(n);
                        }
                    });
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
                    $scope.noti_date = [];
                    angular.forEach(res.data, function (n) {
                        if (n.enable) {
                            $scope.noti_date.push(n);
                        }
                    });
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

        function setModelDate(model) {
            if (model.date) {
                model.date = new Date(model.date);
                model.day = model.date.getDate() + '';
                model.month = (model.date.getMonth() + 1) + '';
                model.date_str = Helper.readableDate(model.date);
                if (model.date.getFullYear() == 1970 && model.day == '1' && model.month == '1') {
                    model.date = undefined;
                    model.day = '';
                    model.month = '';
                }
               
            }
            if (model.exp_date) {
                model.exp_date_str = Helper.readableDate(model.exp_date);
            }
            $scope.file_usage_percentage = model.file_usage/model.max_file_size;
            if ($scope.file_usage_percentage > 1) {
                $scope.file_usage_percentage = 1;
            }
            $scope.file_usage_percentage = $scope.file_usage_percentage * 100;

            var exp_date = new Date(model.exp_date);
            var date_now = new Date();
            if (exp_date < date_now) {
                model.expire = true;
            }
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
            RepairService.get($scope.repairPage, $scope.repair_query).then(function (res) {
                $scope.repairs = res.data;
                initModel($scope.repairs);
                $scope.setRepairPagings(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        };

        $scope.createRepair = function () {
            if ($scope.car.expire) {
                $rootScope.$broadcast(Event.Message.Display, 'รถคันนี้หมดอายุการบันทึกข้อมูลแล้ว กรุณาติดต่อผู้ดูแลระบบเพื่อต่ออายุ');
            }
            else {
                $scope.navigateTo('#/new-repair?car=' + $scope.car.id);
            }
        };

        $scope.carPage();
}]);
