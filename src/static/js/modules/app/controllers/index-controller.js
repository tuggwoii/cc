'use strict';
module.controller('IndexController', ['$scope', '$rootScope', '$q', '$timeout', 'WorkgroupService', 'CarService', 'NotificationService', 'ShareService', 'ShopService', 'Helper', 'Event',
    function ($scope, $rootScope, $q, $timeout, WorkgroupService, CarService, NotificationService, ShareService, ShopService, Helper, Event) {

        $scope.shop_query = {
            page: 1,
            services: '',
            province: '',
            isLoad: false
        };
        $scope.provinces = [];

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
                    if (noti.enable) {
                        noti.date_str = Helper.readableDate(noti.date);
                        if (noti.type == 1) {
                            car.noti_date.push(noti);
                        }
                        else {
                            car.noti_mile.push(noti);
                        }
                    }
                });
                car.noti_date.sort(function (a, b) { return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0); });
                car.noti_mile.sort(function (a, b) { return (a.mile > b.mile) ? 1 : ((b.mile > a.mile) ? -1 : 0); });
                car.all_noti_date = angular.copy(car.noti_date);
                car.all_noti_mile = angular.copy(car.noti_mile);
                if (car.noti_date.length > 3) {
                    car.noti_date.splice(3, car.noti_date.length - 3);
                }
                if (car.noti_mile.length > 3) {
                    car.noti_mile.splice(3, car.noti_mile.length - 3);
                }
            });
            $scope.cars_ = angular.copy($scope.cars);
        }

        function notLoginUser() {
            $q.all([
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                }),
                ShareService.get(1, { limits: 12 }).then(function (res) {
                    $scope.shares = res.data;
                }),
                ShopService.get($scope.shop_query.page).then(function (res) {
                    $scope.shops = res.data;
                    angular.forEach($scope.shops, function (s) {
                        angular.forEach($scope.provinces, function (p) {
                            if (s.province == p.key) {
                                s.province_str = p.th;
                            }
                        });
                    });
                    if (res.meta.count > $scope.shops.length) {
                        $scope.shop_query.hasMore = true;
                    }
                    else {
                        $scope.shop_query.hasMore = false;
                    }
                })
            ])
            .then(function () {
                $timeout(function () {
                    var workSlide = new WorkSlide();
                }, 500);
                $scope.displayView();
            })
            .catch(function () {
                $scope.displayView();
            });
        }

        function loginUser() {
            $q.all([
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                    separateNotificationType($scope.cars);
                }),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                }),
                ShareService.get(1, { limits: 12 }).then(function (res) {
                    $scope.shares = res.data;
                }),
                ShopService.get($scope.shop_query.page).then(function (res) {
                    $scope.shops = res.data;
                    angular.forEach($scope.shops, function (s) {
                        angular.forEach($scope.provinces, function (p) {
                            if (s.province == p.key) {
                                s.province_str = p.th;
                            }
                        });
                    });
                    if (res.meta.count > $scope.shops.length) {
                        $scope.shop_query.hasMore = true;
                    }
                    else {
                        $scope.shop_query.hasMore = false;
                    }
                })
            ])
            .then(function () {
                $timeout(function () {
                    var workSlide = new WorkSlide();
                }, 500);
                $scope.displayView();
            })
            .catch(function () {
                $scope.displayView();
            });
        };

        function groupNotificationByCar(items) {
            var results = [];
            angular.forEach(items, function (noti) {
                var exist = false;
                angular.forEach(results, function (car) {
                    if (car.id == noti.car.id) {
                        car.notifications.push(noti);
                        exist = true;
                    }
                });
                if (!exist) {
                    var noti_car = angular.copy(noti.car);
                    noti_car.notifications = [];
                    noti_car.notifications.push(noti);
                    results.push(noti_car);
                }
            });
            return results;
        }

        function createProvinces() {
            $scope.provinces = _provinces;
        }

        $scope.loadIndex = function () {
            if ($scope.user_ready && $scope.strings_ready) {
                $scope.cars = [];
                createProvinces();
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

        $scope.loadShop = function () {
            $scope.shop_query.page = 1;
            $rootScope.$broadcast(Event.Load.Display);
            $scope.shop_query.isLoad = true;
            ShopService.get($scope.shop_query.page, '', $scope.shop_query.services, $scope.shop_query.province).then(function (res) {
                $scope.shops = res.data;
                angular.forEach($scope.shops, function (s) {
                    angular.forEach($scope.provinces, function (p) {
                        if (s.province == p.key) {
                            s.province_str = p.th;
                        }
                    });
                });
                if (res.meta.count > $scope.shops.length) {
                    $scope.shop_query.hasMore = true;
                }
                else {
                    $scope.shop_query.hasMore = false;
                }
                $timeout(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.shop_query.isLoad = false;
                }, 500);
            })
        };

        $scope.loadMoreShop = function () {
            $scope.shop_query.page++;
            $rootScope.$broadcast(Event.Load.Display);
            $scope.shop_query.isLoad = true;
            ShopService.get($scope.shop_query.page, '', $scope.shop_query.services, $scope.shop_query.province).then(function (res) {
                angular.forEach(res.data, function (s) {
                    angular.forEach($scope.provinces, function (p) {
                        if (s.province == p.key) {
                            s.province_str = p.th;
                        }
                    });
                    $scope.shops.push(s);
                });
                if (res.meta.count > $scope.shops.length) {
                    $scope.shop_query.hasMore = true;
                }
                else {
                    $scope.shop_query.hasMore = false;
                }
                $timeout(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.shop_query.isLoad = false;
                }, 500);
            })
        };

        $scope.shopWorkClick = function (w) {
            angular.forEach($scope.workgroup, function (_w) {
                _w.active = false;
            });
            if (w) {
                w.active = true;
                $scope.shop_query.services = w.name;
            }
            else {
                $scope.shop_query.services = '';
            }
            $scope.loadShop();
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.loadIndex();
}]);
