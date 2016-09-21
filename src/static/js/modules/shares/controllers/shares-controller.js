'use strict';
module.controller('SharesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'WorkgroupService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, WorkgroupService, CarService, Event, Helper) {

        $scope.query = {
            limits: 20
        };

        $scope.provinces = _provinces;

        function initModel(model) {
            angular.forEach(model, function (item) {
                angular.forEach($scope.provinces, function (_province) {
                    if (item.shop.province == _province.key) {
                        item.shop.province_str = _province.th;
                    }
                });
            });
        }

        $scope.sharesPage = function () {
            $scope.currentPage = 1;
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    $q.all([
                         $scope.getAll(),
                         WorkgroupService.get().then(function (res) {
                             $scope.workgroup = angular.copy(res.data);
                         }),
                         CarService.get().then(function (res) {
                             $scope.cars = angular.copy(res.data);
                         })
                    ]).then(function () {
                        $scope.displayView();
                    });
                }
                else {
                    $q.all([
                         $scope.getAll(),
                         WorkgroupService.get().then(function (res) {
                             $scope.workgroup = angular.copy(res.data);
                         })
                    ]).then(function () {
                        $scope.displayView();
                    });
                }
            }
            else {
                $timeout(function () {
                    $scope.sharesPage();
                }, 200);
            }
        };

        $scope.getAll = function (notify) {
            if (notify) {
                $rootScope.$broadcast(Event.Load.Display);
            }
            
            ShareService.get($scope.currentPage, $scope.query).then(function (res) {
                $scope.shares = res.data;
                initModel($scope.shares);
                $scope.meta(res.meta);
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                }
            }).catch(function () {
                //window.location.reload();
            });
        };

        $scope.meta = function (meta) {
            if (meta.limits * $scope.currentPage < meta.count) {
                $scope.hasMore = true;
            }
            else {
                $scope.hasMore = false;
            }
        };

        $scope.loadMore = function () {
            $scope.currentPage++;
            $rootScope.$broadcast(Event.Load.Display);
            ShareService.get($scope.currentPage, { limits: 20 }).then(function (res) {
                initModel(res.data);
                $scope.shares = $scope.shares.concat(res.data);
                $scope.meta(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function () {
                alert('ERROR');
                console.log('ERROR');
                $rootScope.$broadcast(Event.Load.Display);
            });
        }

        $scope.selectWorkgroup = function (work) {
            if (work) {
                if (!work.active) {
                    angular.forEach($scope.workgroup, function (w) {
                        w.active = false;
                    });
                    work.active = true;
                    $scope.query.work = work.id;
                    $scope.getAll(true);
                }
            }
            else {
                angular.forEach($scope.workgroup, function (w) {
                    w.active = false;
                });
                if ($scope.query.work) {
                    delete $scope.query['work'];
                    $scope.getAll(true);
                }
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.sharesPage();
    }]);
