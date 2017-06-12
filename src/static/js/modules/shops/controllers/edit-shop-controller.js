'use strict';
module.controller('EditShopController', ['$scope', '$rootScope', '$timeout', '$q', '$location', '$window', 'Event', 'Helper', 'ShopService', 'WorkService', 'CarService', 'WorkgroupService',
    function ($scope, $rootScope, $timeout, $q, $location, $window, Event, Helper, ShopService, WorkService, CarService, WorkgroupService) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.params = $location.search();
        $scope.carId = $scope.params.car;
        $scope.repairId = $scope.params.repair;
        $scope.from_car = $scope.params.car ? true : false;
        $scope.from_repair = $scope.params.repair ? true : false;
        $scope.isCanEdit = $scope.params.cd == 'true' ? true : false;
        $scope.isFromShops = $scope.params.fs == 'true' ? true : false;
        $scope.provinces = [];

        function getById() {
            return $q(function (resolve, reject) {
                ShopService.getById($scope.params.id).then(function (data) {
                    $scope.model = angular.copy(data);
                    initModel($scope.model);
                    resolve();
                }).catch(function () {
                    reject();
                });
            })
        }

        function initModel(model) {
            if (model.services) {
                model.service_list = model.services.split(',');
            }
        }

        function createProvinces() {
            angular.forEach(areas, function (area) {
                angular.forEach(area.areas, function (p) {
                    $scope.provinces.push(p);
                });
            });
            $scope.provinces.sort(function (a, b) { return (a.th > b.th) ? 1 : ((b.th > a.th) ? -1 : 0); })
        }

        function initWork(model, works) {
            angular.forEach(model.service_list, function (w) {
                angular.forEach(works, function (_w) {
                    if (w == _w.name) {
                        _w.checked = true;
                    }
                });
            });
        }

        function loadResource() {
            createProvinces();
            $q.all([
                getById(),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (res) {
                    $scope.works = angular.copy(res.data);
                })
            ]).then(function () {
                $timeout(function () {
                    if ($scope.model.create_by == $scope.user.id || $scope.isCanEdit) {
                        initWork($scope.model, $scope.works);
                        $scope.displayView();
                    }
                    else {
                        $scope.navigateTo('#!/shop?id=' + $scope.params.id);
                    }
                    checkSize();
                }, 100);
            });
        }

        function isValid() {
            return $scope.user && $scope.user.id;
        }

        $scope.editShopPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    loadResource();
                }
                else {
                    $scope.navigateTo('#!/shop?id=' + $scope.params.id);
                }
            }
            else {
                $timeout(function () {
                    $scope.editShopPage();
                }, 200);
            }

            $rootScope.$broadcast(Event.File.SetType, 3);
        };

        $scope.update = function (notReload) {
            $scope.form_submit = true;
            $scope.status = {};
            angular.forEach($scope.form.$error.required, function (field) {
                field.$setDirty();
            });
            if ($scope.form.$valid) {
                $rootScope.$broadcast(Event.Load.Display);
                ShopService.update($scope.model).then(function () {
                    if (notReload) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }
                    else {
                        if ($scope.from_repair) {
                            $scope.navigateTo('#!/repair?id=' + $scope.repairId + ($scope.carId ? '&car=' + $scope.carId : ''));
                        }
                        else {
                            window.location.href = '/#!/shop?id=' + $scope.model.id + '&cd=true';
                        }
                    }
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $scope.status.error = true;
                });
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.setImage = function (event, file) {
            if ($scope.model) {
                $scope.model.image = file;
                $scope.update(true);
            }
        };

        $scope.workChecked = function (work) {
            work.checked = !work.checked;
            $scope.setServices();
        };

        $scope.checkedAll = function () {
            angular.forEach($scope.works, function (w) {
                w.checked = true;
            });
            $scope.setServices();
        };

        $scope.removeAllChecked = function () {
            angular.forEach($scope.works, function (w) {
                w.checked = false;
            });
            $scope.setServices();
        };

        $scope.setServices = function () {
            $scope.model.services = '';
            var count = 0;
            angular.forEach($scope.works, function (w) {
                if (w.checked) {
                    count++;
                    $scope.model.services += w.name + ',';
                }
            });
            if (!count) {
                $scope.model.services = '';
            }
        };

        $scope.$on(Event.File.Success, $scope.setImage);
        $scope.editShopPage();

        function checkSize() {
            if ($(window).width() <= 750) {
                $scope.imageTop = true;
            }
            else {
                $scope.imageTop = false;
            }
            $scope.$apply();
        }

        $(window).resize(function () {
            checkSize();
        });

    }]);
$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});