'use strict';
var shareWorkSlide;
module.controller('ShopsController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShopService', 'WorkgroupService', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShopService, WorkgroupService, CarService, Event, Helper) {

        $scope.provinces = _provinces;

        $scope.query = {
            page: 1,
            key: '',
            services: '',
            rating: '',
            limits: 24
        };

        function loadModel(notify, isLoadMore) {
            if (notify) {
                $rootScope.$broadcast(Event.Load.Display);
            }
            ShopService.get(
                $scope.query.page,
                $scope.query.limits,
                $scope.query.key,
                $scope.query.services,
                $scope.query.province,
                $scope.query.rating
            )
            .then(function (res) {
                var objects = initModel(res.data);
                if (isLoadMore) {
                    $scope.shops = Helper.mergeArray($scope.shops, objects);
                }
                else {
                    $scope.shops = objects;
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
                    if (item.province == _province.key) {
                        item.province_str = _province.th;
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
        };

        function loadDataForNotLoginUser() {
            $q.all([
                loadModel(),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                })
            ]).then(onFinishLoadData);
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
            ]).then(onFinishLoadData);
        }

        function onFinishLoadData() {
            $timeout(function () {
                shareWorkSlide = new ShareWorkSlide();
            }, 500);
            $scope.displayView();
        }

        function ShopsPage() {
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    if ($scope.user.role.id === 1) {
                        $scope.isCanCreateShop = true;
                    }
                    loadDataForLoginUser();
                }
                else {
                    loadDataForNotLoginUser();
                }
            }
            else {
                $timeout(function () {
                    ShopsPage();
                }, 200);
            }
        };

        $scope.search = function () {
            $scope.query.page = 1;
            loadModel();
        };

        $scope.loadMore = function () {
            $scope.query.page++;
            $scope.isLoadMore = true;
            loadModel(true, true);
        };

        $scope.openCreateShopPopup = function () {
            $rootScope.$broadcast(Event.Shop.DisplayCreatePopup);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        ShopsPage();
}]);
