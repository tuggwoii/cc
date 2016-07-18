'use strict';
module.controller('RepairController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'RepairService', 'Event', 'Helper', 'ShopService', 'WorkService',
    function ($scope, $rootScope, $timeout, $q, $location, RepairService, Event, Helper, ShopService, WorkService) {

        $scope.status = {};
        $scope.search = { key:''};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.process = [];
        $scope.params = $location.search();
        $scope.isRepairPage = $location.$$path.indexOf('/repair') > -1 && $location.$$path.indexOf('/repairs') == -1;
        $scope.isRepairDetail = $scope.params.id && $scope.isRepairPage;

        function getById() {
            RepairService.getById($scope.params.id).then(function (data) {
                $scope.model = angular.copy(data);
                setInitModel($scope.model);
            }).catch(function () {

            });
        }

        function setInitModel(model) {
            model.car = model.for_car + '';
            model.type = model.type + '';
            model.work = model.work + '';
            model.score = model.score + '';
            if (model.date) {
                var date = new Date(model.date);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                var date = date.getDate();
                if (date < 10) {
                    date = '0' + date;
                }
                model.date_str = year + '/' + month + '/' + date;
            }
            datePicker();
            $rootScope.$broadcast(Event.Car.SetActive, model.car);
        }

        function setSubmitModelDate() {
            if ($('input[name=prefix__date__suffix]').val()) {
                $scope.model.date = new Date($('input[name=prefix__date__suffix]').val());
                $scope.empty_date = false;
            }
            else {
                $scope.empty_date = true;
            }
        }

        function datePicker() {
            $timeout(function () {
                $('.datepicker').pickadate({
                    monthsShort: Helper.monthsShort,
                    monthsFull: Helper.monthsFull,
                    format: 'dd mmmm, yyyy',
                    formatSubmit: 'yyyy/mm/dd',
                    hiddenPrefix: 'prefix__',
                    hiddenSuffix: '__suffix'
                });
            }, 500);
        }

        $scope.init = function () {
            $scope.model = {};
            if ($scope.params.id && $scope.isRepairDetail) {
                getById();
            }
            else {
                datePicker();
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.carChange = function () {
            $rootScope.$broadcast(Event.Car.SetActive, $scope.model.car);
        }

        $scope.setModelCar = function (event, carId) {
            $scope.model.car = carId + '';
        };

        $scope.add = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            setSubmitModelDate();
            $scope.form_submit = true;
            if (form.$valid && $scope.model.shop) {
                if (!$scope.empty_date) {
                    $rootScope.$broadcast(Event.Load.Display, 'SAVE_REPAIR');
                    $scope.status = {};
                    RepairService.create($scope.model).then(function (res) {
                        $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_REPAIR');
                        $scope.params.id = res.data.id;
                        $scope.isRepairDetail = true;
                        $scope.status.success = true;
                        $scope.model.id = res.data.id;
                        $scope.navigateTo('#/repair?id=' + res.data.id);
                        $timeout(function () {
                            $rootScope.$broadcast(Event.Load.Dismiss, 'PAGE_CHANGE');
                            $scope.status = {};
                        }, 5000);
                    }).catch(function (res) {
                        if (res.error.message == 'CAR EXPIRE') {
                            $scope.status.car_expire = true;
                        }
                        else {
                            $scope.status.error = true;
                        }
                        
                        $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_REPAIR');
                    });
                }
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.update = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            setSubmitModelDate();
            if (form.$valid) {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_NOTIFICATION');
                $scope.status = {};
                RepairService.update($scope.model).then(function (res) {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                    $scope.status.success = true;
                    $timeout(function () {
                        $scope.status = {};
                    }, 5000);
                }).catch(function (res) {
                    $scope.status.error = true;
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                });
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.remove = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_REPAIR');
                RepairService.delete($scope.params.id).then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_REPAIR');
                    $scope.navigateTo('#/repairs');
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_REPAIR');
                    alert('ERROR');
                });
            });
        };

        var shopSearchTask = {};
        $scope.searchShop = function () {
            $timeout.cancel(shopSearchTask);
            $scope.trySearch = false;
            if ($scope.search.key) {
                if (!$scope.onSearchShop) {
                    shopSearchTask = $timeout(function () {
                        $scope.onSearchShop = true;
                        ShopService.getAll($scope.search.key).then(function (res) {
                            $scope.shops = res.data;
                            $timeout(function () {
                                $scope.onSearchShop = false;
                                $scope.trySearch = true;
                                $timeout(function () {
                                    $('#searchShop').focus();
                                }, 200);
                            }, 500);
                        });
                    }, 1500);
                }
            }
            else {
                $scope.shops = [];
            }
        };

        $scope.createShop = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_SHOP');
                ShopService.create({ name: $scope.search.key }).then(function (res) {
                    console.log(res.data);
                    $scope.model.shop = res.data;
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_SHOP');
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_SHOP');
                    alert('ERROR');
                });
            }, 'คุณยืนยันที่จะสร้างร้าน "' + $scope.search.key + '" หรือไม่?');
        };

        $scope.addWork = function () {
            if ($scope.model.id) {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_WORK');
                $scope.status.work_error = false;
                WorkService.create({
                    repair: $scope.model.id
                }).then(function (res) {
                    if (!$scope.model.repair_works) {
                        $scope.model.repair_works = [];
                    }
                    $scope.model.repair_works.push(res.data);
                    $rootScope.$broadcast(Event.Load.Dismiss, 'PAGE_CHANGE');
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_WORK');
                }).catch(function (err) {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'PAGE_CHANGE');
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_WORK');
                    $scope.status.work_error = true;
                });
            }
        };

        $scope.deleteWork = function (index, work) {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_WORK');
                WorkService.delete(work.id).then(function (res) {
                    $scope.model.repair_works.splice(index, 1);
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_WORK');
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_WORK');
                    alert('ERROR');
                });
            });
        };

        $scope.calPrice = function () {
            var price = 0.0;
            angular.forEach($scope.model.repair_works, function (i) {
                price += i.price;
            });
            $scope.model.price = price;
        };

        $scope.selectShop = function (shop) {
            $scope.model.shop = shop;
        };

        $scope.$on(Event.Page.Ready, function () {
            $scope.init();
        });

        $scope.init();
        $scope.$on(Event.Car.PickCar, $scope.setModelCar);
    }]);
$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});