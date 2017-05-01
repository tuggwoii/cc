'use strict';
var shareWorkSlide;
module.controller('SharesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'WorkgroupService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, WorkgroupService, CarService, Event, Helper) {

        $scope.provinces = _provinces;

        function loadModel(notify, isLoadMode) {
            if (notify) {
                $rootScope.$broadcast(Event.Load.Display);
            }
            ShareService.get($scope.query.page, $scope.query).then(function (res) {
                var objects = initModel(res.data);
                if (isLoadMode) {
                    $scope.shares = Helper.mergeArray($scope.shares, objects);
                }
                else {
                    $scope.shares = objects;
                }
                setMeta(res.meta);
                $scope.isLoadMore = false;
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                }
            }).catch(function () {
                if (isLoadMore) {
                    $scope.query.page--;
                    if ($scope.query.page < 0) {
                        $scope.query.page = 1;
                    }
                }
                $scope.isLoadMore = false;
                $rootScope.$broadcast(Event.Load.Dismiss);
                $rootScope.$broadcast(Event.Message.Display, 'มีบางอย่างผิดพลาดกรุณาลองใหม่');
            });
        }

        function initModel(model) {
            angular.forEach(model, function (item) {
                angular.forEach($scope.provinces, function (_province) {
                    if (item.shop && item.shop.province == _province.key) {
                        item.shop.province_str = _province.th;
                    }
                });
            });
            return model;
        }

        function setMeta(meta) {
            if (meta.limits * $scope.query.page < meta.count) {
                $scope.hasMore = true;
            }
            else {
                $scope.hasMore = false;
            }
        }

        function loadDataForNotLoginUser() {
            $q.all([
                loadModel(),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                })
            ]).then(onLoadFinished);
        }

        function loadDataForLoginUser() {
            $q.all([
                loadModel(),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                })
            ]).then(onLoadFinished);
        }

        function onLoadFinished() {
            $timeout(function () {
                shareWorkSlide = new ShareWorkSlide();
            }, 500);
            $scope.displayView();
        }

        $scope.sharesPage = function () {
      
            $scope.query = {
                limits: 24,
                page: 1
            };

            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    loadDataForLoginUser();
                }
                else {
                    loadDataForNotLoginUser();
                }
            }
            else {
                $timeout(function () {
                    $scope.sharesPage();
                }, 200);
            }
        };

        $scope.getAll = function () {
            loadModel();
        };

        $scope.search = function () {
            $scope.query.page = 1;
            loadModel(true, false);
        };

        $scope.loadMore = function () {
            $scope.query.page++;
            $scope.isLoadMore = true;
            loadModel(true, true);
        };

        $scope.selectWorkgroup = function (work) {
            if (work) {
                if (!work.active) {
                    angular.forEach($scope.workgroup, function (w) {
                        w.active = false;
                    });
                    work.active = true;
                    $scope.query.work = work.id;
                    $scope.query.page = 1;
                    loadModel(true, false);
                }
            }
            else {
                angular.forEach($scope.workgroup, function (w) {
                    w.active = false;
                });
                if ($scope.query.work) {
                    delete $scope.query['work'];
                    $scope.query.page = 1;
                    loadModel(true, false);
                }
            }
        };

        $scope.workgroupChange = function () {
            if ($scope.query.work) {
                angular.forEach($scope.workgroup, function (w) {
                    if ($scope.query.work == w.id) {
                        w.active = true;
                    }
                    else {
                        w.active = false;
                    }
                });
            }
            else {
                angular.forEach($scope.workgroup, function (w) {
                    w.active = false;
                });
                if ($scope.query.work) {
                    delete $scope.query['work'];
                }
            }
            $scope.query.page = 1;
            loadModel(true, false);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.sharesPage();
    }]);
